const Complaint = require('../models/Complaint');
const Agent = require('../models/Agent');
const Category = require('../models/Category');
const { validateComplaintInput } = require('../utils/validators');
const { success, fail } = require('../utils/responseFormatter');
const { createNotification } = require('../services/notificationService');

// @desc    Create a complaint (customer)
// @route   POST /api/complaints
// @access  Private (customer)
const createComplaint = async (req, res, next) => {
  try {
    const { title, description, category, priority } = req.body;
    const errors = validateComplaintInput({ title, description, category });
    if (errors.length) return fail(res, 400, errors.join(', '));

    const categoryExists = await Category.findById(category);
    if (!categoryExists) return fail(res, 400, 'Selected category does not exist');

    const attachment = req.file ? `/uploads/${req.file.filename}` : '';

    const complaint = await Complaint.create({
      customerId: req.user._id,
      category,
      title,
      description,
      priority: priority || 'medium',
      attachment,
      timeline: [{ status: 'open', note: 'Complaint raised by customer', changedBy: req.user._id }],
    });

    return success(res, 201, 'Complaint submitted successfully', { complaint });
  } catch (err) {
    next(err);
  }
};

// @desc    Get complaints (filtered by role)
// @route   GET /api/complaints
// @access  Private
const getComplaints = async (req, res, next) => {
  try {
    const { status, priority, category, search, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (req.user.role === 'customer') filter.customerId = req.user._id;
    if (req.user.role === 'agent') filter.agentId = req.user._id;
    // admin sees all

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { complaintId: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = Math.max(parseInt(page), 1);
    const limitNum = Math.max(parseInt(limit), 1);
    const skip = (pageNum - 1) * limitNum;

    const [complaints, total] = await Promise.all([
      Complaint.find(filter)
        .populate('customerId', 'name email avatar')
        .populate('agentId', 'name email avatar')
        .populate('category', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Complaint.countDocuments(filter),
    ]);

    return success(res, 200, 'Complaints fetched', { complaints }, {
      pagination: { total, page: pageNum, pages: Math.ceil(total / limitNum) || 1 },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single complaint by id
// @route   GET /api/complaints/:id
// @access  Private
const getComplaintById = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id)
      .populate('customerId', 'name email avatar phone')
      .populate('agentId', 'name email avatar')
      .populate('category', 'name')
      .populate('timeline.changedBy', 'name role');

    if (!complaint) return fail(res, 404, 'Complaint not found');

    // Ownership check for non-admins
    const isOwnerCustomer = req.user.role === 'customer' && String(complaint.customerId._id) === String(req.user._id);
    const isAssignedAgent = req.user.role === 'agent' && complaint.agentId && String(complaint.agentId._id) === String(req.user._id);
    if (req.user.role !== 'admin' && !isOwnerCustomer && !isAssignedAgent) {
      return fail(res, 403, 'You do not have access to this complaint');
    }

    return success(res, 200, 'Complaint fetched', { complaint });
  } catch (err) {
    next(err);
  }
};

// @desc    Update complaint (status/priority/assign agent/feedback)
// @route   PUT /api/complaints/:id
// @access  Private (agent/admin for status, customer for feedback)
const updateComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return fail(res, 404, 'Complaint not found');

    const { status, priority, agentId, note, feedback } = req.body;

    if (req.user.role === 'customer') {
      // Customers may only submit feedback once resolved, on their own complaint
      if (String(complaint.customerId) !== String(req.user._id)) {
        return fail(res, 403, 'You do not have access to this complaint');
      }
      if (feedback) {
        complaint.feedback = { ...feedback, submittedAt: new Date() };
      }
    } else {
      // Agent or admin
      if (req.user.role === 'agent' && String(complaint.agentId) !== String(req.user._id)) {
        return fail(res, 403, 'This complaint is not assigned to you');
      }

      if (status && status !== complaint.status) {
        complaint.status = status;
        complaint.timeline.push({ status, note: note || `Status changed to ${status}`, changedBy: req.user._id });
        await createNotification({
          userId: complaint.customerId,
          title: 'Complaint status updated',
          body: `Your complaint ${complaint.complaintId} is now "${status}"`,
          type: 'status',
          link: `/complaints/${complaint._id}`,
        });
      }

      if (priority) complaint.priority = priority;

      if (agentId && req.user.role === 'admin') {
        complaint.agentId = agentId;
        await Agent.findOneAndUpdate({ userId: agentId }, { $addToSet: { assignedComplaints: complaint._id } });
        await createNotification({
          userId: agentId,
          title: 'New complaint assigned',
          body: `Complaint ${complaint.complaintId} has been assigned to you`,
          type: 'assignment',
          link: `/complaints/${complaint._id}`,
        });
      }
    }

    await complaint.save();
    return success(res, 200, 'Complaint updated', { complaint });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete complaint
// @route   DELETE /api/complaints/:id
// @access  Private (admin, or customer who owns an open complaint)
const deleteComplaint = async (req, res, next) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) return fail(res, 404, 'Complaint not found');

    const isOwner = String(complaint.customerId) === String(req.user._id);
    if (req.user.role !== 'admin' && !(isOwner && complaint.status === 'open')) {
      return fail(res, 403, 'You cannot delete this complaint');
    }

    await complaint.deleteOne();
    return success(res, 200, 'Complaint deleted', null);
  } catch (err) {
    next(err);
  }
};

module.exports = { createComplaint, getComplaints, getComplaintById, updateComplaint, deleteComplaint };
