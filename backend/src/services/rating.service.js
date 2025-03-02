const { PrismaClient } = require("@prisma/client");
const productService = require("../services/product.service.js");

const prisma = new PrismaClient();

/**
 * Create a new rating
 * @param {Object} req - The request object containing the rating details
 * @param {Object} user - The user object
 * @returns {Object} - The created rating
 */
async function createRating(req, user) {
  try {
    const { productId, rating } = req;
    console.log("productId: ", productId);

    if (isNaN(productId)) {
      throw new Error("Invalid product ID");
    }

    const product = await productService.findProductById(productId);

    if (!product) {
      throw new Error("Product not found");
    }

    const createdRating = await prisma.rating.create({
      data: {
        productId: product.id,
        userId: user.id,
        rating: parseFloat(rating),
        createdAt: new Date(),
      },
    });

    return createdRating;
  } catch (error) {
    console.error("Error creating rating: ", error.message);
    throw new Error("Failed to create rating: " + error.message);
  }
}

/**
 * Get ratings for a specific product
 * @param {Number} productId - The product ID
 * @returns {Array} - The list of ratings for the product
 */
async function getProductsRating(productId) {
  try {
    const parsedId = parseInt(productId, 10);
    if (isNaN(parsedId)) {
      throw new Error("Invalid product ID");
    }

    const ratings = await prisma.rating.findMany({
      where: { productId: parsedId },
    });

    return ratings;
  } catch (error) {
    console.error("Error retrieving product ratings: ", error.message);
    throw new Error("Failed to retrieve product ratings: " + error.message);
  }
}

module.exports = {
  createRating,
  getProductsRating,
};