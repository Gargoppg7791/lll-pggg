const reviewService = require('../services/review.service.js');

const createReview = async (req, res) => {
  const user = req.user;
  const reqBody = req.body;

  if (!reqBody.productId || !reqBody.review) {
    return res.status(400).json({ error: 'Product ID and review are required' });
  }

  console.log(`Creating review for product ID ${reqBody.productId}`);

  try {
    const review = await reviewService.createReview(reqBody, user);
    return res.status(201).send(review);
  } catch (error) {
    console.log("Error creating review: ", error.message);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

const getAllReview = async (req, res) => {
  const productId = req.params.productId;

  if (!productId) {
    return res.status(400).json({ error: 'Product ID is required' });
  }

  console.log(`Fetching reviews for product ID ${productId}`);

  try {
    const reviews = await reviewService.getAllReview(productId);
    return res.status(200).send(reviews);
  } catch (error) {
    console.log("Error fetching reviews: ", error.message);
    return res.status(500).json({ error: 'Something went wrong' });
  }
};

module.exports = { createReview, getAllReview };