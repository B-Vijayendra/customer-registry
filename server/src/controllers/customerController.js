const User = require('../models/User');
const Customer = require('../models/Customer');
const { success, fail } = require('../utils/responseFormatter');

// @desc    Get all customers (admin)
// @route   GET /api/customers
// @access  Private (admin)
const getCustomers = async (req, res, next) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const userFilter = { role: 'customer' };
    if (search) {
      userFilter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = Math.max(parseInt(page), 1);
    const limitNum = Math.max(parseInt(limit), 1);
    const skip = (pageNum - 1) * limitNum;

    const [users, total] = await Promise.all([
      User.find(userFilter).select('-password').sort({ createdAt: -1 }).skip(skip).limit(limitNum),
      User.countDocuments(userFilter),
    ]);

    return success(res, 200, 'Customers fetched', { customers: users }, {
      pagination: { total, page: pageNum, pages: Math.ceil(total / limitNum) || 1 },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update a customer's profile fields (admin or self)
// @route   PUT /api/customers/:id
// @access  Private
const updateCustomer = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin' && String(req.user._id) !== req.params.id) {
      return fail(res, 403, 'You cannot update this customer');
    }

    const user = await User.findById(req.params.id);
    if (!user) return fail(res, 404, 'Customer not found');

    const { name, phone, address, isActive, preferences } = req.body;
    if (name) user.name = name;
    if (phone !== undefined) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (typeof isActive === 'boolean' && req.user.role === 'admin') user.isActive = isActive;
    await user.save();

    if (preferences) {
      await Customer.findOneAndUpdate({ userId: user._id }, { preferences }, { upsert: true });
    }

    return success(res, 200, 'Customer updated', { user: user.toSafeObject() });
  } catch (err) {
    next(err);
  }
};

module.exports = { getCustomers, updateCustomer };
