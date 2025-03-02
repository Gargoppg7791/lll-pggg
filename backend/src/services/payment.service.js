const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const razorpay = require("../config/razorpayClient");

const MAX_AMOUNT = 1000000000; // Example maximum amount in paise (10,000,000.00 INR)

const createPaymentLink = async (orderId) => {
  try {
    const parsedOrderId = parseInt(orderId, 10);
    if (isNaN(parsedOrderId)) {
      throw new Error("Invalid order ID");
    }

    const order = await prisma.order.findUnique({
      where: { id: parsedOrderId },
      include: { user: true },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    const amountInPaise = order.totalPrice; // Convert amount to paise
    if (amountInPaise > MAX_AMOUNT) {
      throw new Error(`Amount exceeds the maximum allowed limit of ${MAX_AMOUNT / 100} INR.`);
    }

    const paymentLinkRequest = {
      amount: amountInPaise, // Amount in paise
      currency: 'INR',
      customer: {
        name: `${order.user.firstName} ${order.user.lastName}`,
        contact: order.user.mobile,
        email: order.user.email,
      },
      notify: {
        sms: true,
        email: true,
      },
      reminder_enable: true,
      callback_url: `http://localhost:3000/${orderId}`,
      callback_method: 'get',
    };

    const paymentLink = await razorpay.paymentLink.create(paymentLinkRequest);

    const paymentLinkId = paymentLink.id;
    const payment_link_url = paymentLink.short_url;

    const resData = {
      paymentLinkId: paymentLinkId,
      payment_link_url,
    };
    return resData;
  } catch (error) {
    console.error('Error creating payment link:', error);
    throw new Error(error.message);
  }
};

const updatePaymentInformation = async (reqData) => {
  const paymentId = reqData.payment_id;
  const orderId = reqData.order_id;

  try {
    const parsedOrderId = parseInt(orderId, 10);
    if (isNaN(parsedOrderId)) {
      throw new Error("Invalid order ID");
    }

    const order = await prisma.order.findUnique({
      where: { id: parsedOrderId },
      include: { user: true },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    const payment = await razorpay.payments.fetch(paymentId);

    if (payment.status === 'captured') {
      await prisma.order.update({
        where: { id: parsedOrderId },
        data: {
          paymentDetails: {
            create: {
              paymentId: paymentId,
              status: 'COMPLETED',
            },
          },
          orderStatus: 'PLACED',
        },
      });
    }

    const resData = { message: 'Your order is placed', success: true };
    return resData;
  } catch (error) {
    console.error('Error processing payment:', error);
    throw new Error(error.message);
  }
};

module.exports = { createPaymentLink, updatePaymentInformation };