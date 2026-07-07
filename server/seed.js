// One-off seed script: creates default categories and an admin user.
// Usage: node seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./src/config/db');
const User = require('./src/models/User');
const Category = require('./src/models/Category');

const run = async () => {
  await connectDB();

  const categories = ['Billing', 'Technical Support', 'Account', 'Product Feedback', 'Other'];
  for (const name of categories) {
    await Category.findOneAndUpdate({ name }, { name }, { upsert: true });
  }
  console.log(`Seeded ${categories.length} categories`);

  const adminEmail = 'admin@customerregistry.com';
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    await User.create({
      name: 'System Admin',
      email: adminEmail,
      password: 'Admin@123',
      role: 'admin',
    });
    console.log(`Admin created -> email: ${adminEmail} / password: Admin@123`);
  } else {
    console.log('Admin already exists, skipping');
  }

  await mongoose.connection.close();
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
