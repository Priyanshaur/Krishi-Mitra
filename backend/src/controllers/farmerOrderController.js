import Order from '../models/Order.js';

// GET ORDERS FOR A SPECIFIC FARMER
export const getFarmerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ sellerId: req.user.id })
      .populate('buyerId', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Error fetching farmer orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching farmer orders'
    });
  }
};

// GET A SPECIFIC ORDER FOR A FARMER
export const getFarmerOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ 
      _id: req.params.id, 
      sellerId: req.user.id 
    }).populate('buyerId', 'name email');
    
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
    
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, sellerId: req.user.id },
      { status, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate('buyerId', 'name email');
    
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
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order status'
    });
  }
};