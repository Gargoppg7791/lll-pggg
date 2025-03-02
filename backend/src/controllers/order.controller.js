const orderService = require("../services/order.service.js");

/**
 * Create a new order
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
const createOrder = async (req, res) => {
    const user = req.user;
    try {
        const createdOrder = await orderService.createOrder(user, req.body);
        console.log("order ", createdOrder);
        return res.status(201).send(createdOrder);
    } catch (error) {
        console.error("Error creating order: ", error.message);
        return res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
};

/**
 * Find an order by its ID
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
const findOrderById = async (req, res) => {
    const user = req.user;
    try {
        const order = await orderService.findOrderById(req.params.id);
        return res.status(200).send(order);
    } catch (error) {
        console.error("Error finding order: ", error.message);
        return res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
};

/**
 * Get order history for the logged-in user
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
const orderHistory = async (req, res) => {
    const user = req.user;
    try {
        const orders = await orderService.usersOrderHistory(user.id);
        return res.status(200).send(orders);
    } catch (error) {
        console.error("Error retrieving order history: ", error.message);
        return res.status(500).send({ message: "Internal Server Error", error: error.message });
    }
};

module.exports = { createOrder, findOrderById, orderHistory };