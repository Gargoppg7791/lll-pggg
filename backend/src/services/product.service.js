const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

/**
 * Create a new product
 * @param {Object} reqData - The product data to create
 * @returns {Object} - The created product
 */
async function createProduct(reqData) {
  try {
    // Find or create top-level category
    let topLevel = await prisma.category.findFirst({
      where: {
        name: reqData.topLevelCategory,
        parentCategoryId: null,
      },
    });

    if (!topLevel) {
      topLevel = await prisma.category.create({
        data: {
          name: reqData.topLevelCategory,
          level: 1,
          parentCategoryId: null,
        },
      });
    }

    // Find or create second-level category
    let secondLevel = await prisma.category.findFirst({
      where: {
        name: reqData.secondLevelCategory,
        parentCategoryId: topLevel.id,
      },
    });

    if (!secondLevel) {
      secondLevel = await prisma.category.create({
        data: {
          name: reqData.secondLevelCategory,
          parentCategoryId: topLevel.id,
          level: 2,
        },
      });
    }

    // Find or create third-level category
    let thirdLevel = await prisma.category.findFirst({
      where: {
        name: reqData.thirdLevelCategory,
        parentCategoryId: secondLevel.id,
      },
    });

    if (!thirdLevel) {
      thirdLevel = await prisma.category.create({
        data: {
          name: reqData.thirdLevelCategory,
          parentCategoryId: secondLevel.id,
          level: 3,
        },
      });
    }

    // Create the product
    const product = await prisma.product.create({
      data: {
        title: reqData.title,
        color: reqData.color,
        description: reqData.description,
        discountedPrice: (parseInt(reqData.discountedPrice, 10)) * 100,
        discountPercent: (parseInt(reqData.discountPercent, 10)) * 100,
        imageUrl: reqData.imageUrl,
        brand: reqData.brand,
        price: (parseInt(reqData.price, 10)) * 100,
        sizes: {
          create: reqData.sizes.map((size) => ({
            name: size.name,
            quantity: parseInt(size.quantity, 10),
          })),
        },
        quantity: parseInt(reqData.quantity, 10),
        categoryId: thirdLevel.id,
      },
      include: {
        sizes: true,
      },
    });

    return product;
  } catch (error) {
    console.error("Error creating product: ", error.message);
    throw new Error("Failed to create product: " + error.message);
  }
}

/**
 * Find a product by ID
 * @param {Number} id - The product ID to find
 * @returns {Object} - The found product
 */
async function findProductById(id) {
  try {
    const parsedId = parseInt(id, 10);
    if (isNaN(parsedId)) {
      throw new Error("Invalid product ID");
    }

    const product = await prisma.product.findUnique({
      where: {
        id: parsedId,
      },
      include: {
        category: true,
        sizes: true,
        ratings: true,
        reviews: true,
      },
    });

    if (!product) {
      throw new Error("Product not found with id " + id);
    }

    return product;
  } catch (error) {
    console.error("Error finding product: ", error.message);
    throw new Error("Failed to find product: " + error.message);
  }
}

/**
 * Delete a product by ID
 * @param {Number} productId - The product ID to delete
 * @returns {String} - Deletion message
 */
async function deleteProduct(productId) {
  try {
    const product = await findProductById(productId);

    if (!product) {
      throw new Error("Product not found with id " + productId);
    }

    // Use transaction to ensure all deletions succeed or none do
    await prisma.$transaction(async (tx) => {
      // 1. Delete CartItems (has foreign key to Product)
      await tx.cartItem.deleteMany({
        where: {
          productId: parseInt(productId)
        }
      });

      // 2. Delete OrderItems (has foreign key to Product)
      await tx.orderItem.deleteMany({
        where: {
          productId: parseInt(productId)
        }
      });

      // 3. Delete Reviews (has foreign key to Product)
      await tx.review.deleteMany({
        where: {
          productId: parseInt(productId)
        }
      });

      // 4. Delete Ratings (has foreign key to Product)
      await tx.rating.deleteMany({
        where: {
          productId: parseInt(productId)
        }
      });

      // 5. Delete Sizes (has foreign key to Product)
      await tx.size.deleteMany({
        where: {
          productId: parseInt(productId)
        }
      });

      // 6. Finally delete the Product
      await tx.product.delete({
        where: {
          id: parseInt(productId)
        }
      });
    });

    return "Product deleted successfully";
  } catch (error) {
    console.error("Error deleting product: ", error.message);
    throw new Error("Failed to delete product: " + error.message);
  }
}

/**
 * Update a product by ID
 * @param {Number} productId - The product ID to update
 * @param {Object} reqData - The product data to update
 * @returns {Object} - The updated product
 */
async function updateProduct(productId, reqData) {
  try {
    const updatedProduct = await prisma.product.update({
      where: {
        id: parseInt(productId),
      },
      data: {
        title: reqData.title,
        color: reqData.color,
        description: reqData.description,
        discountedPrice: parseInt(reqData.discountedPrice, 10),
        discountPercent: parseInt(reqData.discountPercent, 10),
        imageUrl: reqData.imageUrl,
        brand: reqData.brand,
        price: parseInt(reqData.price, 10),
        sizes: {
          deleteMany: {}, // Delete existing sizes
          create: reqData.sizes.map((size) => ({
            name: size.name,
            quantity: parseInt(size.quantity, 10),
          })),
        },
        quantity: parseInt(reqData.quantity, 10),
        categoryId: reqData.categoryId,
      },
      include: {
        sizes: true,
      },
    });

    return updatedProduct;
  } catch (error) {
    console.error("Error updating product: ", error.message);
    throw new Error("Failed to update product: " + error.message);
  }
}

/**
 * Get all products with filtering and pagination
 * @param {Object} reqQuery - The query parameters for filtering and pagination
 * @returns {Object} - The filtered and paginated products
 */
async function getAllProducts(reqQuery) {
  try {
    let {
      category,
      color,
      sizes,
      minPrice,
      maxPrice,
      minDiscount,
      sort,
      stock,
      pageNumber,
      pageSize,
    } = reqQuery;

    pageSize = parseInt(pageSize) || 10;
    pageNumber = parseInt(pageNumber) || 1;

    let whereClause = {};

    if (category) {
      const existCategory = await prisma.category.findUnique({
        where: {
          name: category,
        },
      });
      if (existCategory) {
        whereClause.categoryId = existCategory.id;
      } else {
        return { content: [], currentPage: 1, totalPages: 1 };
      }
    }

    if (color) {
      const colorSet = new Set(
        color.split(",").map((color) => color.trim().toLowerCase())
      );
      whereClause.color = { in: [...colorSet] };
    }

    if (sizes) {
      const sizesSet = new Set(sizes.split(",").map((size) => size.trim()));
      whereClause.sizes = {
        some: {
          name: { in: [...sizesSet] },
        },
      };
    }

    if (minPrice || maxPrice) {
      whereClause.discountedPrice = {};
      if (minPrice) whereClause.discountedPrice.gte = parseFloat(minPrice);
      if (maxPrice) whereClause.discountedPrice.lte = parseFloat(maxPrice);
    }

    if (minDiscount) {
      whereClause.discountPercent = { gt: parseFloat(minDiscount) };
    }

    if (stock) {
      if (stock === "in_stock") {
        whereClause.quantity = { gt: 0 };
      } else if (stock === "out_of_stock") {
        whereClause.quantity = { lte: 0 };
      }
    }

    let orderByClause = [];
    if (sort) {
      if (sort === "price_high") {
        orderByClause.push({ discountedPrice: "desc" });
      } else if (sort === "price_low") {
        orderByClause.push({ discountedPrice: "asc" });
      }
    }

    const totalProducts = await prisma.product.count({ where: whereClause });

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        category: true,
        sizes: true,
      },
      orderBy: orderByClause,
      skip: (pageNumber - 1) * pageSize,
      take: pageSize,
    });

    const totalPages = Math.ceil(totalProducts / pageSize);

    return { content: products, currentPage: pageNumber, totalPages: totalPages };
  } catch (error) {
    console.error("Error getting all products: ", error.message);
    throw new Error("Failed to get products: " + error.message);
  }
}


/**
 * Search products by query
 * @param {String} query - The search query
 * @returns {Array} - The found products
 */
async function searchProduct(query) {
  try {
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { brand: { contains: query, mode: "insensitive" } },
          { color: { contains: query, mode: "insensitive" } },
        ],
      },
      include: {
        category: true,
        sizes: true,
      },
    });

    return products;
  } catch (error) {
    console.error("Error searching products: ", error.message);
    throw new Error("Failed to search products: " + error.message);
  }
}

/**
 * Create multiple products
 * @param {Array} products - The array of product data to create
 */
async function createMultipleProduct(products) {
  try {
    for (let product of products) {
      await createProduct(product);
    }
  } catch (error) {
    console.error("Error creating multiple products: ", error.message);
    throw new Error("Failed to create multiple products: " + error.message);
  }
}

module.exports = {
  createProduct,
  findProductById,
  deleteProduct,
  updateProduct,
  getAllProducts,
  searchProduct,
  createMultipleProduct,
};