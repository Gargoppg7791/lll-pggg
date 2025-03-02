const { PrismaClient } = require("@prisma/client");
const productService = require("../services/product.service.js");

const prisma = new PrismaClient();

/**
 * Create a new review
 * @param {Object} reqData - The request data containing the review details
 * @param {Object} user - The user object
 * @returns {Object} - The created review
 */
async function createReview(reqData, user) {
  try {
    const product = await productService.findProductById(reqData.productId);

    if (!product) {
      throw new Error("Product not found with id " + reqData.productId);
    }

    const review = await prisma.review.create({
      data: {
        userId: user.id,
        productId: product.id,
        review: reqData.review,
        createdAt: new Date(),
      },
    });

    return review;
  } catch (error) {
    console.error("Error creating review: ", error.message);
    throw new Error("Failed to create review: " + error.message);
  }
}

/**
 * Get all reviews for a specific product
 * @param {Number} productId - The product ID
 * @returns {Array} - The list of reviews for the product
 */
async function getAllReview(productId) {
  try {
    const product = await productService.findProductById(productId);

    if (!product) {
      throw new Error("Product not found with id " + productId);
    }

    const reviews = await prisma.review.findMany({
      where: { productId: product.id },
      include: { user: true },
    });

    return reviews;
  } catch (error) {
    console.error("Error retrieving reviews: ", error.message);
    throw new Error("Failed to retrieve reviews: " + error.message);
  }
}

module.exports = {
  createReview,
  getAllReview,
};