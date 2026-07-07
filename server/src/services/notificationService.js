const Notification = require('../models/Notification');

// Centralized helper so controllers don't repeat notification-creation logic.
const createNotification = async ({ userId, title, body = '', type = 'info', link = '' }) => {
  try {
    return await Notification.create({ userId, title, body, type, link });
  } catch (error) {
    console.error('Failed to create notification:', error.message);
    return null;
  }
};

module.exports = { createNotification };
