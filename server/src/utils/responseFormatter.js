// Consistent API response shape across the app.
const success = (res, statusCode, message, data = null, extra = {}) => {
  return res.status(statusCode).json({ success: true, message, data, ...extra });
};

const fail = (res, statusCode, message) => {
  return res.status(statusCode).json({ success: false, message });
};

module.exports = { success, fail };
