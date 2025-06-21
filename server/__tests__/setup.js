import mongoose from 'mongoose';

afterAll(async () => {
  await mongoose.connection.close();
  // Skip Redis cleanup until lib/redis.js is fixed
});