import { updateProfile } from '../controllers/user.controllers.js';
import User from '../models/user.model.js';
import Notification from '../models/notification.model.js';
import AppError from '../errors/AppError.js';
import { getProfile } from '../controllers/user.controllers.js';
import cloudinary from 'cloudinary';
import '../lib/cloudinary.js';

jest.mock('cloudinary', () => ({
  v2: {
    config: jest.fn(),
    uploader: {
      upload: jest.fn(),
      destroy: jest.fn(),
    },
  },
}));
jest.mock('../models/user.model.js');
jest.mock('../models/notification.model.js');



describe('updateProfile', () => {
  test('should update user with valid input', async () => {
    const mockUser = {
      _id: '123',
      name: 'Old Name',
      email: 'test@misrify.com',
      save: jest.fn().mockResolvedValue({ _id: '123', name: 'New Name', password: null }),
      comparePassword: jest.fn().mockResolvedValue(true),
    };
    User.findById.mockResolvedValue(mockUser);
    Notification.create.mockResolvedValue({});

    const req = {
      user: { id: '123' },
      body: { name: 'New Name', email: 'test@misrify.com' },
    };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    await updateProfile(req, res, next);

    expect(mockUser.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, message: 'Profile updated successfully' })
    );
    expect(next).not.toHaveBeenCalled();
  });
  test('should return error for missing current password', async () => {
  User.findById.mockResolvedValue({ _id: '123' });
  const req = {
    user: { id: '123' },
    body: { newPassword: 'NewPass123' },
  };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  const next = jest.fn();

  await updateProfile(req, res, next);

  expect(next).toHaveBeenCalledWith(expect.any(AppError));
  expect(res.status).not.toHaveBeenCalled();
});
test('should return error if user not found', async () => {
  User.findById.mockResolvedValue(null);
  const req = { user: { id: '123' }, body: { name: 'Any' } };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  const next = jest.fn();

  await updateProfile(req, res, next);

  expect(next).toHaveBeenCalledWith(expect.any(AppError));
});
test('should return error if current password is incorrect', async () => {
  const mockUser = {
    _id: '123',
    comparePassword: jest.fn().mockResolvedValue(false),
  };
  User.findById.mockResolvedValue(mockUser);

  const req = {
    user: { id: '123' },
    body: {
      currentPassword: 'wrong-password',
      newPassword: 'NewPass123'
    },
  };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  const next = jest.fn();

  await updateProfile(req, res, next);

  expect(next).toHaveBeenCalledWith(expect.any(AppError));
});

test('should update user with new profile image', async () => {
  const mockUser = {
    _id: 'user1',
    name: 'Old Name',
    email: 'test@example.com',
    save: jest.fn().mockResolvedValue({
      _id: 'user1',
      name: 'New Name',
      email: 'test@example.com',
      profileImage: 'https://mock-image.com/profile.jpg',
      password: null,
    }),
  };
  User.findById.mockResolvedValue(mockUser);
  cloudinary.v2.uploader.upload.mockResolvedValue({
    secure_url: 'https://mock-image.com/profile.jpg',
  });

  const req = {
    user: { _id: 'user1' },
    body: { name: 'New Name', imgUrl: 'base64image' },
  };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  const next = jest.fn();

  await updateProfile(req, res, next);

  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({
    message: 'Profile updated successfully',
    success: true,
    user: {
      _id: 'user1',
      name: 'New Name',
      email: 'test@example.com',
      profileImage: 'https://mock-image.com/profile.jpg',
      password: null,
    },
  });
  expect(next).not.toHaveBeenCalled();
});
});

describe('getProfile', () => {
  test('should return user profile', async () => {
    const req = { user: { _id: '123', name: 'Test User', email: 'test@misrify.com' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    await getProfile(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, user: req.user })
    );
    expect(next).not.toHaveBeenCalled();
  });
});