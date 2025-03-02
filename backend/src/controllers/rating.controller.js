const ratingService = require('../services/rating.service.js');

/**
 * Create a new rating
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
const createRating = async (req, res) => {
  try {
    const user = req.user;
    const { productId, rating } = req.body;
    console.log("productId: ", productId);
    if (!productId || isNaN(parseInt(productId, 10))) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    const ratingData = {
      productId: parseInt(productId, 10),
      rating: parseFloat(rating)
    };

    const createdRating = await ratingService.createRating(ratingData, user);

    res.status(201).json(createdRating);
  } catch (error) {
    console.error("Error creating rating: ", error.message);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

/**
 * Get ratings for a specific product
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
const getProductsRating = async (req, res) => {
  try {
    const productId = req.params.productId;
    const ratings = await ratingService.getProductsRating(productId);
    res.status(200).json(ratings);
  } catch (error) {
    console.error("Error retrieving product ratings: ", error.message);
    res.status(500).json({ error: 'Something went wrong' });
  }
};

module.exports = { getProductsRating, createRating };