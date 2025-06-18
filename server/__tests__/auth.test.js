import { login } from '../controllers/auth.controllers.js';
import User from '../models/user.model.js';
import LoginAttempt from '../models/loginAttempt.model.js';
import AppError from '../errors/AppError.js';
import * as jwtService from '../services/jwt.service.js';
jest.mock('../models/user.model.js');
jest.mock('../models/loginAttempt.model.js');
jest.mock('../services/jwt.service.js', () => ({
  generateToken: jest.fn(),
  storeTokenInRedis: jest.fn(),
  storeTokenInCookies: jest.fn(),
}));

describe('login', () => {
 test('should return success for valid credentials', async () => {
  const mockUser = {
    _id: 'user1',
    email: 'userTest@gmail.com',
    password: 'hashedPassword123',
    isVerified: true,
    comparePassword: jest.fn().mockResolvedValue(true),
  };
  User.findOne.mockResolvedValue(mockUser);
  jwtService.generateToken.mockReturnValue({
    accessToken: 'mock-access-token',
    refreshToken: 'mock-refresh-token',
  });
  jwtService.storeTokenInRedis.mockResolvedValue(undefined);
  LoginAttempt.create.mockResolvedValue({});

  const req = {
    body: { email: 'userTest@gmail.com', password: 'user@123' },
  };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  const next = jest.fn();

  await login(req, res, next);

  expect(User.findOne).toHaveBeenCalledWith({ email: 'userTest@gmail.com' });
  expect(mockUser.comparePassword).toHaveBeenCalledWith('user@123');
  expect(jwtService.generateToken).toHaveBeenCalledWith('user1');
  expect(jwtService.storeTokenInRedis).toHaveBeenCalledWith('user1', 'mock-refresh-token');
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({
    success: true,
    message: 'User Logged In Successfully',
    user: expect.any(Object),
  });
  expect(next).not.toHaveBeenCalled();
  });
  test('should return error for invalid credentials', async () => {
    User.findOne.mockResolvedValue(null);
    const req = { body: { email: 'wrong@misrify.com', password: 'WrongPass' } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    await login(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    expect(res.status).not.toHaveBeenCalled();
  });
  test('should return error for incorrect password', async () => {
  const mockUser = {
    _id: '123',
    email: 'test@misrify.com',
    isVerified: true,
    comparePassword: jest.fn().mockResolvedValue(false),
  };
  User.findOne.mockResolvedValue(mockUser);
  LoginAttempt.create.mockResolvedValue({});

  const req = { body: { email: 'test@misrify.com', password: 'WrongPass123' } };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  const next = jest.fn();

  await login(req, res, next);

  expect(next).toHaveBeenCalledWith(expect.any(AppError));
  expect(res.status).not.toHaveBeenCalled();
  });
  test('should return error for unverified user', async () => {
  const mockUser = {
    _id: '123',
    email: 'test@misrify.com',
    isVerified: false,
    comparePassword: jest.fn().mockResolvedValue(true),
  };
  User.findOne.mockResolvedValue(mockUser);
  LoginAttempt.create.mockResolvedValue({});

  const req = { body: { email: 'test@misrify.com', password: 'SecurePass123' } };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  const next = jest.fn();

  await login(req, res, next);

  expect(next).toHaveBeenCalledWith(expect.any(AppError));
  expect(res.status).not.toHaveBeenCalled();
  });
});