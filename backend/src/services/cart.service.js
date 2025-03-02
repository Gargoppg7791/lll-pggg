const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

/**
 * Create a new cart for a user
 * @param {Number} userId - The user ID to create a cart for
 * @returns {Object} - The created cart
 */
async function createCart(userId) {
  try {
    const cart = await prisma.cart.create({
      data: {
        userId: userId, // Pass only the userId here
      },
    });
    return cart;
  } catch (error) {
    throw new Error("Failed to create cart: " + error.message);
  }
}

/**
 * Find a user's cart and update cart details
 * @param {Number} userId - The user ID to find the cart for
 * @returns {Object} - The found and updated cart
 */
async function findUserCart(userId) {
  try {
    let cart = await prisma.cart.findUnique({
      where: { userId: userId },
      include: { cartItems: { include: { product: true } } },
    });

    if (!cart) {
      throw new Error("Cart not found for user: " + userId);
    }

    let totalPrice = 0;
    let totalDiscountedPrice = 0;
    let totalItem = 0;

    for (const cartItem of cart.cartItems) {
      totalPrice += cartItem.price;
      totalDiscountedPrice += cartItem.discountedPrice;
      totalItem += cartItem.quantity;
    }

    cart = await prisma.cart.update({
      where: { id: cart.id },
      data: {
        totalPrice: totalPrice,
        totalItem: totalItem,
        totalDiscountedPrice: totalDiscountedPrice,
        discount: totalPrice - totalDiscountedPrice,
      },
      include: { cartItems: { include: { product: true } } },
    });

    return cart;
  } catch (error) {
    throw new Error("Failed to find or update cart: " + error.message);
  }
}

/**
 * Add an item to the user's cart
 * @param {Number} userId - The user ID to add the item to the cart for
 * @param {Object} req - The request object containing productId and size
 * @returns {String} - A message indicating the item was added
 */
async function addCartItem(userId, req) {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: userId },
    });

    if (!cart) {
      throw new Error("Cart not found for user: " + userId);
    }

    const product = await prisma.product.findUnique({
      where: { id: parseInt(req.productId) },
    });

    if (!product) {
      throw new Error("Product not found: " + req.productId);
    }

    const existingCartItem = await prisma.cartItem.findFirst({
      where: { cartId: cart.id, productId: product.id, userId: userId },
    });

    if (!existingCartItem) {
      await prisma.cartItem.create({
        data: {
          productId: product.id,
          cartId: cart.id,
          quantity: 1,
          userId: userId,
          price: product.price,
          size: req.size,
          discountedPrice: product.discountedPrice,
        },
      });
    }

    return 'Item added to cart';
  } catch (error) {
    throw new Error("Failed to add item to cart: " + error.message);
  }
}

module.exports = { createCart, findUserCart, addCartItem };