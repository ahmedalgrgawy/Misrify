// server/__tests__/checkout.test.js
import { placeOrder } from '../controllers/checkout.controllers.js';
import Order from '../models/order.model.js';
import Product from '../models/product.model.js';
import User from '../models/user.model.js';
import Coupon from '../models/coupon.model.js';
import OrderItem from '../models/orderItem.model.js';
import Notification from '../models/notification.model.js';
import AppError from '../errors/AppError.js';
import axios from 'axios';
jest.mock('axios');
jest.mock('../models/order.model.js');
jest.mock('../models/product.model.js');
jest.mock('../models/user.model.js');
jest.mock('../models/coupon.model.js');
jest.mock('../models/orderItem.model.js');
jest.mock('../models/notification.model.js');

describe('placeOrder', () => {
  test('should create order with valid products and coupon', async () => {
    const mockUserId = 'userId123';
    const mockProduct = { _id: 'prod1', price: 100, quantityInStock: 10 };
    const mockOrderItem = { _id: 'orderItem1', product: mockProduct._id, quantity: 1, price: 100 };
    const mockCoupon = {
      _id: 'coupon1',
      discount: 10,
      isActive: true,
      save: jest.fn(),
    };

    Product.findById.mockResolvedValue(mockProduct);
    OrderItem.create.mockResolvedValue(mockOrderItem);
    Coupon.findOne.mockResolvedValue(mockCoupon);
    User.findByIdAndUpdate.mockResolvedValue({});
    Order.create.mockResolvedValue({ _id: 'order1', trackCode: 'ORD-123', totalPrice: 90 });
    Notification.create.mockResolvedValue({});

    // FIX: handle nested populate properly
    Order.findById.mockImplementation(() => ({
      populate: jest.fn().mockImplementation(() => ({
        populate: jest.fn().mockResolvedValue({
          _id: 'order1',
          orderItems: [],
          coupon: { code: 'TEST10', discount: 10 },
          totalPrice: 90,
          trackCode: 'ORD-123',
        }),
      })),
    }));

    const req = {
      user: { _id: mockUserId },
      body: {
        orderItems: [
          { product: mockProduct._id, quantity: 1, color: 'black', size: 'M' },
        ],
        shippingAddress: 'Cairo',
        shippingMethod: 'standard',
        coupon: 'TEST10',
      },
    };

    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();
    axios.post.mockResolvedValue({ data: { token: 'mock-token' } });

    await placeOrder(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        order: expect.objectContaining({
          totalPrice: 90,
          coupon: expect.objectContaining({ discount: 10 }),
        }),
      })
    );
    expect(next).not.toHaveBeenCalled();
  });
  test('should return error for non-existent product', async () => {
  Product.findById.mockResolvedValue(null); // منتج غير موجود
  const req = {
    user: { _id: 'user1' },
    body: {
      orderItems: [{ product: 'nonexistent', quantity: 1, color: 'black', size: 'M' }],
      shippingAddress: 'Cairo',
      shippingMethod: 'standard',
    },
  };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  const next = jest.fn();
  axios.post.mockResolvedValue({ data: { token: 'mock-token' } });

  await placeOrder(req, res, next);

  expect(next).toHaveBeenCalledWith(expect.any(AppError));
  expect(res.status).not.toHaveBeenCalled();
  });
  test('should return error for invalid coupon', async () => {
  Product.findById.mockResolvedValue({ _id: 'prod1', price: 100, quantityInStock: 10 });
  Coupon.findOne.mockResolvedValue(null);
  OrderItem.create.mockResolvedValue({
    _id: 'orderItem1',
    product: 'prod1',
    quantity: 1,
    color: 'black',
    size: 'M',
    price: 100,
  });
  const req = {
    user: { _id: 'user1' },
    body: {
      orderItems: [{ product: 'prod1', quantity: 1, color: 'black', size: 'M' }],
      shippingAddress: 'Cairo',
      shippingMethod: 'standard',
      coupon: 'INVALID',
    },
  };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  const next = jest.fn();
  axios.post.mockResolvedValue({ data: { token: 'mock-token' } });

  await placeOrder(req, res, next);

  expect(next).toHaveBeenCalledWith(expect.any(AppError));
  expect(res.status).not.toHaveBeenCalled();
  });
  test('should return error for invalid quantity', async () => {
  Product.findById.mockResolvedValue({ _id: 'prod1', price: 100, quantityInStock: 10 });
  const req = {
    user: { _id: 'user1' },
    body: {
      orderItems: [{ product: 'prod1', quantity: 0, color: 'black', size: 'M' }],
      shippingAddress: 'Cairo',
      shippingMethod: 'standard',
    },
  };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  const next = jest.fn();
  axios.post.mockResolvedValue({ data: { token: 'mock-token' } });

  await placeOrder(req, res, next);

  expect(next).toHaveBeenCalledWith(expect.any(AppError));
  expect(res.status).not.toHaveBeenCalled();
  });
  test('should return error for invalid shipping address', async () => {
  Product.findById.mockResolvedValue({ _id: 'prod1', price: 100, quantityInStock: 10 });
  const req = {
    user: { _id: 'user1' },
    body: {
      orderItems: [{ product: 'prod1', quantity: 1, color: 'black', size: 'M' }],
      shippingAddress: '', // عنوان فارغ
      shippingMethod: 'standard',
    },
  };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  const next = jest.fn();
  axios.post.mockResolvedValue({ data: { token: 'mock-token' } });

  await placeOrder(req, res, next);

  expect(next).toHaveBeenCalledWith(expect.any(AppError));
  expect(res.status).not.toHaveBeenCalled();
  });
  test('should return error for invalid shipping method', async () => {
  Product.findById.mockResolvedValue({ _id: 'prod1', price: 100, quantityInStock: 10 });
  const req = {
    user: { _id: 'user1' },
    body: {
      orderItems: [{ product: 'prod1', quantity: 1, color: 'black', size: 'M' }],
      shippingAddress: 'Cairo',
      shippingMethod: '', // طريقة شحن فارغة
    },
  };
  const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  const next = jest.fn();
  axios.post.mockResolvedValue({ data: { token: 'mock-token' } });

  await placeOrder(req, res, next);

  expect(next).toHaveBeenCalledWith(expect.any(AppError));
  expect(res.status).not.toHaveBeenCalled();
  });
});
