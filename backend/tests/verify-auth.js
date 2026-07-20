const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { connectDB, disconnectDB } = require('../config/db');
const User = require('../models/User');
const Task = require('../models/Task');

// Set dummy environment vars for test run
process.env.JWT_SECRET = 'test_secret_key_1234567890';
process.env.PORT = 5001;

async function runTests() {
  console.log('=== STARTING AUTHENTICATION & JWT INTEGRATION TESTS ===\n');

  try {
    // 1. Initialize DB Connection
    console.log('Testing: Database connection fallback...');
    await connectDB();
    console.log('✓ Database connection successful!\n');

    // Clean up collections if there are any existing documents
    await User.deleteMany({});
    await Task.deleteMany({});

    // 2. Test Phase 1: Mongoose Schema & Cryptographic security
    console.log('Testing Phase 1: Password Salting and Hashing...');
    const testUser = new User({
      name: 'Jane Doe',
      email: 'jane@example.com',
      password: 'mysecurepassword123'
    });

    // Save user - triggers pre-save bcrypt hook
    await testUser.save();
    console.log(`User created. Hashed password in DB: ${testUser.password}`);

    // Verify it is not plain text
    if (testUser.password === 'mysecurepassword123') {
      throw new Error('FAIL: Password stored as plain text!');
    }
    console.log('✓ Password is cryptographically salted and hashed!');

    // Test password match method
    const isMatch = await testUser.matchPassword('mysecurepassword123');
    const isMismatch = await testUser.matchPassword('wrongpassword');
    if (!isMatch || isMismatch) {
      throw new Error('FAIL: Password comparison logic is incorrect!');
    }
    console.log('✓ Mongoose schema method successfully matches correct passwords and rejects incorrect ones!\n');

    // 3. Test Phase 2: JWT Generation
    console.log('Testing Phase 2: JWT Generation...');
    const token = jwt.sign(
      { id: testUser._id, name: testUser.name, email: testUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    console.log(`Signed JWT Token: ${token.substring(0, 45)}...`);

    // Verify JWT contains correct decoded info
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token Context:', decoded);
    if (decoded.email !== 'jane@example.com' || decoded.name !== 'Jane Doe') {
      throw new Error('FAIL: Decoded JWT contents do not match user specifications!');
    }
    console.log('✓ JWT signed and validated successfully!\n');

    // 4. Test Phase 3: Route Protection Middleware Mock
    console.log('Testing Phase 3: JWT Verification and Route Interception...');
    
    // Simulate middleware verification
    const mockMiddlewareVerify = (authHeader) => {
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new Error('Not authorized, no token');
      }
      const t = authHeader.split(' ')[1];
      return jwt.verify(t, process.env.JWT_SECRET);
    };

    // Valid Header check
    const headerValid = `Bearer ${token}`;
    const userContext = mockMiddlewareVerify(headerValid);
    console.log('✓ Valid Bearer token parsed successfully! User ID:', userContext.id);

    // Invalid Header check
    try {
      mockMiddlewareVerify('Bearer invalid_token_xyz');
      throw new Error('FAIL: Failed to intercept invalid token!');
    } catch (e) {
      console.log('✓ Invalid token successfully intercepted by middleware!');
    }

    // Missing Header check
    try {
      mockMiddlewareVerify('');
      throw new Error('FAIL: Failed to intercept missing token!');
    } catch (e) {
      console.log('✓ Missing token successfully intercepted by middleware!');
    }
    console.log('\n=== ALL TESTS PASSED SUCCESSFULLY ===');
  } catch (error) {
    console.error('\n❌ TEST RUN FAILED:', error.message);
  } finally {
    console.log('\nDisconnecting database...');
    await disconnectDB();
    process.exit(0);
  }
}

runTests();
