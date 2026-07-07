const Message = require('../models/Message');
const Complaint = require('../models/Complaint');
const { success, fail } = require('../utils/responseFormatter');
const { createNotification } = require('../services/notificationService');

// @desc    Send a message tied to a complaint (customer <-> agent chat)
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res, next) => {
  try {
    const { complaintId, receiver, message } = req.body;
    if (!complaintId || !receiver || !message) {
      return fail(res, 400, 'complaintId, receiver and message are required');
    }

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) return fail(res, 404, 'Complaint not found');

    const isOwnerCustomer = req.user.role === 'customer' && String(complaint.customerId) === String(req.user._id);
    const isAssignedAgent = req.user.role === 'agent' && String(complaint.agentId) === String(req.user._id);
    if (req.user.role !== 'admin' && !isOwnerCustomer && !isAssignedAgent) {
      return fail(res, 403, 'You cannot message on this complaint');
    }

    const newMessage = await Message.create({
      sender: req.user._id,
      receiver,
      complaintId,
      message,
    });

    await createNotification({
      userId: receiver,
      title: 'New message',
      body: `${req.user.name} sent a message on ${complaint.complaintId}`,
      type: 'message',
      link: `/chat/${complaintId}`,
    });

    return success(res, 201, 'Message sent', { message: newMessage });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all messages for a complaint
// @route   GET /api/messages?complaintId=...
// @access  Private
const getMessages = async (req, res, next) => {
  try {
    const { complaintId } = req.query;
    if (!complaintId) return fail(res, 400, 'complaintId query param is required');

    const complaint = await Complaint.findById(complaintId);
    if (!complaint) return fail(res, 404, 'Complaint not found');

    const isOwnerCustomer = req.user.role === 'customer' && String(complaint.customerId) === String(req.user._id);
    const isAssignedAgent = req.user.role === 'agent' && String(complaint.agentId) === String(req.user._id);
    if (req.user.role !== 'admin' && !isOwnerCustomer && !isAssignedAgent) {
      return fail(res, 403, 'You cannot view messages on this complaint');
    }

    const messages = await Message.find({ complaintId })
      .populate('sender', 'name role avatar')
      .populate('receiver', 'name role avatar')
      .sort({ createdAt: 1 });

    // Mark messages addressed to current user as read
    await Message.updateMany({ complaintId, receiver: req.user._id, isRead: false }, { isRead: true });

    return success(res, 200, 'Messages fetched', { messages });
  } catch (err) {
    next(err);
  }
};

module.exports = { sendMessage, getMessages };
