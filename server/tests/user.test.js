const mongoose = require('mongoose');
const User = require('../models/user');

beforeAll(async () => {
  // התחברות למסד בדיקות (למשל MongoDB in-memory)
  await mongoose.connect(process.env.MONGO_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('User Model Unit Tests', () => {

  it('should create a user with required fields', async () => {
    const user = new User({
      fullName: 'Test User',
      email: 'test@example.com',
      phone: '0500000000',
      address: 'Test Address',
      role: 'user'
    });

    const savedUser = await user.save();

    expect(savedUser._id).toBeDefined();
    expect(savedUser.fullName).toBe('Test User');
    expect(savedUser.role).toBe('user');
  });

  it('should not save user without required email', async () => {
  const user = new User({
    fullName: 'No Email',
    phone: '0501234567',
    address: 'Nowhere',
    role: 'user'
  });

  let validationError;
  let saveError;

  // שלב 1: ולידציה בלבד
  try {
    await user.validate();
  } catch (err) {
    validationError = err;
  }

  expect(validationError).toBeDefined();
  expect(validationError.errors.email).toBeDefined();

  // אם יש שגיאת ולידציה, לא ממשיכים לשמור
  if (validationError) return;

  // שלב 2: שמירה למסד נתונים (לא אמור להגיע לכאן במקרה של שגיאת ולידציה)
  try {
    await user.save();
  } catch (err) {
    saveError = err;
  }

  // אם השמירה נכשלת מסיבה אחרת (לא ולידציה)
  expect(saveError).toBeUndefined();
});
  it('should default role to "user" if not provided', async () => {
    const user = new User({
      fullName: 'No Role',
      email: 'noroletest@example.com',
      phone: '0501111111',
      address: 'Test Address'
    });

    const savedUser = await user.save();

    expect(savedUser.role).toBe('user');
  });
});