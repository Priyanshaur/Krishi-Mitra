import Order from '../models/Order.js';
import User from '../models/User.js';
import OrderItem from '../models/OrderItem.js';

// GET ORDERS FOR A SPECIFIC FARMER
export const getFarmerOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { sellerId: req.user.id },
      include: [
        {
          model: User,
          as: 'buyer',
          attributes: ['name', 'email']
        },
        {
          model: OrderItem,
          as: 'items'
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Error fetching farmer orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching farmer orders: ' + error.message
    });
  }
};

// GET A SPECIFIC ORDER FOR A FARMER
export const getFarmerOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      where: {
        id: req.params.id,
        sellerId: req.user.id
      },
      include: [
        { model: User, as: 'buyer', attributes: ['name', 'email'] },
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
    console.error('Error fetching farmer order:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching farmer order'
    });
  }
};

// UPDATE ORDER STATUS BY FARMER
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // Validate status
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const order = await Order.findOne({
      where: {
        id: req.params.id,
        sellerId: req.user.id
      }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update status
    order.status = status;
    await order.save();

    // Refetch with associations to return complete object
    const updatedOrder = await Order.findByPk(order.id, {
      include: [
        { model: User, as: 'buyer', attributes: ['name', 'email'] },
        { model: OrderItem, as: 'items' }
      ]
    });

    res.json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order status'
    });
  }
};