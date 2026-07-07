const Notification = require('../models/Notification');
const { success, fail } = require('../utils/responseFormatter');

// @desc    Get logged-in user's notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(50);
    const unreadCount = await Notification.countDocuments({ userId: req.user._id, read: false });
    return success(res, 200, 'Notifications fetched', { notifications, unreadCount });
  } catch (err) {
    next(err);
  }
};

// @desc    Mark a notification (or all) as read
// @route   PUT /api/notifications/:id
// @access  Private
const markAsRead = async (req, res, next) => {
  try {
    if (req.params.id === 'all') {
      await Notification.updateMany({ userId: req.user._id, read: false }, { read: true });
      return success(res, 200, 'All notifications marked as read', null);
    }

    const notification = await Notification.findOne({ _id: req.params.id, userId: req.user._id });
    if (!notification) return fail(res, 404, 'Notification not found');

    notification.read = true;
    await notification.save();
    return success(res, 200, 'Notification marked as read', { notification });
  } catch (err) {
    next(err);
  }
};

module.exports = { getNotifications, markAsRead };
