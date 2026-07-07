const User = require('../models/User');
const Customer = require('../models/Customer');
const Agent = require('../models/Agent');
const generateToken = require('../utils/generateToken');
const { validateRegisterInput } = require('../utils/validators');
const { success, fail } = require('../utils/responseFormatter');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, address } = req.body;

    const errors = validateRegisterInput({ name, email, password });
    if (errors.length) return fail(res, 400, errors.join(', '));

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return fail(res, 400, 'An account with this email already exists');

    // Only allow customer/agent self-registration; admin accounts are seeded/promoted manually.
    const safeRole = ['customer', 'agent'].includes(role) ? role : 'customer';

    const user = await User.create({ name, email, password, role: safeRole, phone, address });

    if (safeRole === 'customer') {
      await Customer.create({ userId: user._id });
    } else if (safeRole === 'agent') {
      await Agent.create({ userId: user._id });
    }

    const token = generateToken(user._id);
    return success(res, 201, 'Registration successful', { user: user.toSafeObject(), token });
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return fail(res, 400, 'Email and password are required');

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return fail(res, 401, 'Invalid email or password');

    if (!user.isActive) return fail(res, 403, 'This account has been deactivated');

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return fail(res, 401, 'Invalid email or password');

    const token = generateToken(user._id);
    return success(res, 200, 'Login successful', { user: user.toSafeObject(), token });
  } catch (err) {
    next(err);
  }
};

// @desc    Get logged-in user's profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res, next) => {
  try {
    return success(res, 200, 'Profile fetched', { user: req.user.toSafeObject() });
  } catch (err) {
    next(err);
  }
};

// @desc    Update logged-in user's profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address, avatar } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return fail(res, 404, 'User not found');

    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();
    return success(res, 200, 'Profile updated', { user: user.toSafeObject() });
  } catch (err) {
    next(err);
  }
};

module.exports = { register, login, getProfile, updateProfile };
