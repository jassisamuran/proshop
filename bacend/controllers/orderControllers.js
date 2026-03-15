import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
// import order from '../models/orderModel.js'

const addOrderItems = asyncHandler(async (re, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    i,
  } = re.body;
  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error(" No order items");
    return;
  } else {
    // console.log(re.user)
    // console.log(re.user.name)
    // console.log(re.user._id)
    const order = new Order({
      orderItems,
      user: re.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });
    const createOrder = await order.save();
    console.log(createOrder);
    res.status(201).json({ createOrder });
  }
});

const getOrderById = asyncHandler(async (re, res) => {
  const order = await Order.findById(re.params.id).populate(
    "user",
    "name email",
  );
  console.log(order);
  console.log(re.params.id);
  if (order) {
    console.log("no");
    console.log(order);
    res.json(order);
  } else {
    console.log("eroor");
    res.status(404);
    throw new Error("Error not found");
  }
});

const updateOrderToPaid = asyncHandler(async (re, res) => {
  console.log("one");
  console.log(re.body._id);
  console.log(re.params._id);
  const order = await Order.findById(re.params._id);

  if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: re.body.id,
      status: re.body.status,
      update_time: re.body.update_time,
      email_address: re.body.payer.email_address,
    };
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(400);
    throw new Error("order not found");
  }
});

const updateOrderToDelivered = asyncHandler(async (re, res) => {
  const order = await Order.findById(re.params.id);
  console.log(order);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(400);
    throw new Error("order not found");
  }
});

const getMyOrders = asyncHandler(async (re, res) => {
  const orders = await Order.find({ user: re.user._id });
  res.json(orders);
});

const getOrders = asyncHandler(async (re, res) => {
  const orders = await Order.find({}).populate("user", "id name");
  res.json(orders);
});

export const listOrders = asyncHandler(async (req, res) => {
  const days = Number(req.query.days) || 30;
  const status = req.query.status;
  const limit = Number(req.query.limit) || 50;
  const sortBy = req.query.sort_by || "date_desc";

  const fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - days);

  let query = {
    user: req.user._id,
    createdAt: { $gte: fromDate },
  };

  if (status && status !== "all") {
    query.status = status;
  }

  let sort = { createdAt: -1 };

  if (sortBy === "date_asc") sort = { createdAt: 1 };
  if (sortBy === "amount_desc") sort = { totalPrice: -1 };
  if (sortBy === "amount_asc") sort = { totalPrice: 1 };

  const orders = await Order.find(query).sort(sort).limit(limit).lean();

  const formattedOrders = orders.map((order) => ({
    id: order._id,
    order_id: order._id,
    status: order.status,
    total_amount: order.totalPrice,
    created_at: order.createdAt,
    items: order.orderItems,
  }));

  res.json({
    orders: formattedOrders,
  });
});
const getOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  console.log("now is", order);

  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  res.json({
    order_id: order._id,
    status: order.isDelivered
      ? "delivered"
      : order.isPaid
        ? "shipped"
        : "processing",
    isPaid: order.isPaid,
    isDelivered: order.isDelivered,
    paidAt: order.paidAt,
    deliveredAt: order.deliveredAt,
    totalPrice: order.totalPrice,
    shippingAddress: order.shippingAddress,
  });
});

export {
  addOrderItems,
  getMyOrders,
  getOrderById,
  getOrders,
  getOrderStatus,
  updateOrderToDelivered,
  updateOrderToPaid,
};
