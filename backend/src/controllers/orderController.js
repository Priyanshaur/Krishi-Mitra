import Order from '../models/Order.js';
import OrderItem from '../models/OrderItem.js';
import User from '../models/User.js';
import MarketItem from '../models/MarketItem.js';
import sequelize from '../config/db.js';

export const createOrder = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { items, shippingAddress, ...orderData } = req.body;

    // Map shipping address
    const shippingData = {
      shipping_street: shippingAddress?.street,
      shipping_city: shippingAddress?.city,
      shipping_state: shippingAddress?.state,
      shipping_pincode: shippingAddress?.pincode,
      shipping_contactNumber: shippingAddress?.contactNumber,
    };

    const order = await Order.create({
      ...orderData,
      ...shippingData,
      buyerId: req.user.id,
      status: 'pending',
      paymentStatus: 'pending'
    }, { transaction: t });

    // Process Order Items
    if (items && items.length > 0) {
      const orderItems = [];

      for (const item of items) {
        // Fetch market item to check availability
        const marketItem = await MarketItem.findByPk(item.marketItemId, { transaction: t });

        if (!marketItem) {
          throw new Error(`Item ${item.title} not found`);
        }

        if (marketItem.quantity < item.quantity) {
          throw new Error(`Insufficient quantity for ${item.title}. Available: ${marketItem.quantity}`);
        }

        // Deduct quantity
        const newQuantity = marketItem.quantity - item.quantity;
        await marketItem.update({
          quantity: newQuantity,
          status: newQuantity === 0 ? 'sold' : 'active'
        }, { transaction: t });

        orderItems.push({
          orderId: order.id,
          itemId: item.marketItemId,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          unit: item.unit
        });
      }

      await OrderItem.bulkCreate(orderItems, { transaction: t });
    }

    await t.commit();

    // Fetch the created order with items to return
    const createdOrder = await Order.findByPk(order.id, {
      include: [{ model: OrderItem, as: 'items' }]
    });

    res.status(201).json({
      success: true,
      data: createdOrder
    });
  } catch (error) {
    await t.rollback();
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error creating order',
      error: error.message
    });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: User, as: 'buyer', attributes: ['name'] },
        { model: User, as: 'seller', attributes: ['name'] }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders'
    });
  }
};

export const getOrder = async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: User, as: 'buyer', attributes: ['name', 'email'] },
        { model: User, as: 'seller', attributes: ['name', 'email'] },
        { model: OrderItem, as: 'items' }
      ]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order'
    });
  }
};

export const getUserOrders = async (req, res) => {
  console.log('Fetching user orders for:', req.user.id);
  try {
    const orders = await Order.findAll({
      where: { buyerId: req.user.id },
      include: [
        { model: User, as: 'seller', attributes: ['name', 'location'] },
        {
          model: OrderItem,
          as: 'items',
          include: [{
            model: MarketItem,
            attributes: ['images']
          }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    console.log('Found orders:', orders.length);
    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Error fetching user orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user orders'
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByPk(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.status = status;
    await order.save();

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order'
    });
  }
};