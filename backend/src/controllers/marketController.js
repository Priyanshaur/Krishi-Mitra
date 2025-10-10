import MarketItem from '../models/MarketItem.js';

// GET REAL MARKET ITEMS FROM DATABASE
export const getMarketItems = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      minPrice,
      maxPrice,
      location,
      organic,
      qualityGrade,
      search
    } = req.query;

    // Build REAL database query
    const filter = { status: 'active' };
    
    if (category) filter.category = category;
    if (organic) filter.organic = organic === 'true';
    if (qualityGrade) filter.qualityGrade = qualityGrade;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (location) {
      filter.$or = [
        { 'location.city': new RegExp(location, 'i') },
        { 'location.state': new RegExp(location, 'i') }
      ];
    }
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { description: new RegExp(search, 'i') }
      ];
    }

    // REAL DATABASE QUERY
    const items = await MarketItem.find(filter)
      .populate('sellerId', 'name profile phone')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await MarketItem.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: items,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get Market Items Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching market items from database'
    });
  }
};

// GET SINGLE REAL MARKET ITEM
export const getMarketItem = async (req, res) => {
  try {
    const item = await MarketItem.findById(req.params.id)
      .populate('sellerId', 'name profile phone');

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Market item not found in database'
      });
    }

    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Get Market Item Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching market item from database'
    });
  }
};

// CREATE REAL MARKET ITEM IN DATABASE
export const createMarketItem = async (req, res) => {
  try {
    const marketItem = await MarketItem.create({
      ...req.body,
      sellerId: req.user.id
    });

    // Populate seller info
    await marketItem.populate('sellerId', 'name profile');

    res.status(201).json({
      success: true,
      data: marketItem
    });
  } catch (error) {
    console.error('Create Market Item Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating market item in database'
    });
  }
};

// UPDATE MARKET ITEM
export const updateMarketItem = async (req, res) => {
  try {
    let marketItem = await MarketItem.findById(req.params.id);

    if (!marketItem) {
      return res.status(404).json({
        success: false,
        message: 'Market item not found'
      });
    }

    // Check ownership
    if (marketItem.sellerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this item'
      });
    }

    marketItem = await MarketItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: marketItem
    });
  } catch (error) {
    console.error('Update Market Item Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating market item'
    });
  }
};

// DELETE MARKET ITEM
export const deleteMarketItem = async (req, res) => {
  try {
    const marketItem = await MarketItem.findById(req.params.id);

    if (!marketItem) {
      return res.status(404).json({
        success: false,
        message: 'Market item not found'
      });
    }

    // Check ownership
    if (marketItem.sellerId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this item'
      });
    }

    await MarketItem.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Market item deleted successfully'
    });
  } catch (error) {
    console.error('Delete Market Item Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting market item'
    });
  }
};

// GET USER'S MARKET ITEMS
export const getUserMarketItems = async (req, res) => {
  try {
    const items = await MarketItem.find({ sellerId: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: items
    });
  } catch (error) {
    console.error('Get User Market Items Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user market items'
    });
  }
};