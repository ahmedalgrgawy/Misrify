import Product from "../models/product.model.js";
import Review from "../models/review.model.js";

export const getStockLevel = async (req, res, next) => {
    const products = await Product.find().select("name quantityInStock");

    res.status(200).json({
        success: true,
        message: "Stock levels fetched successfully",
        products,
    });
};

const getProductsWithAvgRatings = async (req, res, next) => {
    try {
      // Extract query parameters for pagination, sorting, and filtering
      const {
        page = 1,
        limit = 10,
        sortBy = 'name',
        order = 'asc',
        category,
        minRating,
      } = req.query;
  
      // Validate and sanitize inputs
      const pageNum = Math.max(1, parseInt(page));
      const limitNum = Math.min(100, Math.max(1, parseInt(limit))); // Cap limit to 100
      const sortOrder = order === 'desc' ? -1 : 1;
  
      // Build match stage for filtering
      const matchStage = {};
      if (category) {
        matchStage.category = category;
      }
  
      // Aggregation pipeline
      const pipeline = [
        // Apply filtering (e.g., by category)
        { $match: matchStage },
  
        // Lookup reviews
        {
          $lookup: {
            from: 'reviews',
            localField: 'reviews',
            foreignField: '_id',
            as: 'reviewArray',
          },
        },
  
        // Unwind reviews
        {
          $unwind: {
            path: '$reviewArray',
            preserveNullAndEmptyArrays: true,
          },
        },
  
        // Group to calculate metrics
        {
          $group: {
            _id: '$_id',
            name: { $first: '$name' },
            price: { $first: '$price' }, // Include additional fields as needed
            totalReviews: { $sum: { $cond: [{ $ifNull: ['$reviewArray', false] }, 1, 0] } },
            averageRating: { $avg: '$reviewArray.rating' },
          },
        },
  
        // Project final output
        {
          $project: {
            name: 1,
            price: 1,
            totalReviews: 1,
            averageRating: {
              $cond: {
                if: { $gt: ['$totalReviews', 0] },
                then: { $round: ['$averageRating', 2] }, // Round to 2 decimals
                else: null, // Return null for no reviews
              },
            },
          },
        },
  
        // Sorting
        {
          $sort: {
            [sortBy]: sortOrder,
          },
        },
  
        // Pagination
        {
          $skip: (pageNum - 1) * limitNum,
        },
        {
          $limit: limitNum,
        },
      ];
  
      // Execute aggregation with lean for performance
      const products = await Product.aggregate(pipeline).exec();
  
      // Get total count for pagination metadata (optional)
      const totalPipeline = [
        { $match: matchStage },
        { $count: 'total' },
      ];
      const totalResult = await Product.aggregate(totalPipeline).exec();
      const total = totalResult[0]?.total || 0;
  
      // Return response
      res.status(200).json({
        success: true,
        message: 'Products with their reviews count and average ratings fetched successfully',
        data: {
          products,
          pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages: Math.ceil(total / limitNum),
          },
        },
      });
    } catch (error) {
      // Pass error to error-handling middleware
      next(error);
    }
  };