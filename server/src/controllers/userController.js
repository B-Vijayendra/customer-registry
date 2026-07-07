const User = require('../models/User');
const Agent = require('../models/Agent');
const Customer = require('../models/Customer');
const Complaint = require('../models/Complaint');
const { success, fail } = require('../utils/responseFormatter');

// @desc    Get all users (admin)
// @route   GET /api/users
// @access  Private (admin)
const getUsers = async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 10 } = req.query;
    const filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = Math.max(parseInt(page), 1);
    const limitNum = Math.max(parseInt(limit), 1);
    const skip = (pageNum - 1) * limitNum;

    const [users, total] = await Promise.all([
      User.find(filter).select('-password').sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      User.countDocuments(filter),
    ]);

    return success(res, 200, 'Users fetched', { users }, {
      pagination: { total, page: pageNum, pages: Math.ceil(total / limitNum) || 1 },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a user (admin can create agents/admins directly)
// @route   POST /api/users
// @access  Private (admin)
const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, address } = req.body;
    if (!name || !email || !password) return fail(res, 400, 'Name, email and password are required');

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return fail(res, 400, 'An account with this email already exists');

    const user = await User.create({ name, email, password, role: role || 'customer', phone, address });

    if (user.role === 'customer') await Customer.create({ userId: user._id });
    if (user.role === 'agent') await Agent.create({ userId: user._id });

    return success(res, 201, 'User created', { user: user.toSafeObject() });
  } catch (err) {
    next(err);
  }
};

// @desc    Update any user (admin) - role, active status, etc.
// @route   PUT /api/users/:id
// @access  Private (admin)
const updateUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return fail(res, 404, 'User not found');

    const { name, role, isActive, phone, address } = req.body;
    const previousRole = user.role;

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (typeof isActive === 'boolean') user.isActive = isActive;
    if (role && role !== previousRole) {
      user.role = role;
      if (role === 'agent') await Agent.findOneAndUpdate({ userId: user._id }, {}, { upsert: true });
      if (role === 'customer') await Customer.findOneAndUpdate({ userId: user._id }, {}, { upsert: true });
    }

    await user.save();
    return success(res, 200, 'User updated', { user: user.toSafeObject() });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a user (admin)
// @route   DELETE /api/users/:id
// @access  Private (admin)
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return fail(res, 404, 'User not found');

    if (String(user._id) === String(req.user._id)) {
      return fail(res, 400, 'You cannot delete your own account');
    }

    await user.deleteOne();
    await Agent.deleteOne({ userId: user._id });
    await Customer.deleteOne({ userId: user._id });

    return success(res, 200, 'User deleted', null);
  } catch (err) {
    next(err);
  }
};

// @desc    Admin analytics summary
// @route   GET /api/users/analytics
// @access  Private (admin)
const getAnalytics = async (req, res, next) => {
  try {
    const [totalCustomers, totalAgents, totalComplaints, openComplaints, inProgress, resolved, closed] = await Promise.all([
      User.countDocuments({ role: 'customer' }),
      User.countDocuments({ role: 'agent' }),
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: 'open' }),
      Complaint.countDocuments({ status: 'in_progress' }),
      Complaint.countDocuments({ status: 'resolved' }),
      Complaint.countDocuments({ status: 'closed' }),
    ]);

    const byCategory = await Complaint.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $lookup: { from: 'categories', localField: '_id', foreignField: '_id', as: 'category' } },
      { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } },
      { $project: { _id: 0, name: { $ifNull: ['$category.name', 'Uncategorized'] }, count: 1 } },
    ]);

    const last7Days = await Complaint.aggregate([
      { $match: { createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return success(res, 200, 'Analytics fetched', {
      totals: { totalCustomers, totalAgents, totalComplaints, openComplaints, inProgress, resolved, closed },
      byCategory,
      last7Days,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getUsers, createUser, updateUser, deleteUser, getAnalytics };
