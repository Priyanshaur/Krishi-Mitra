import MarketItem from '../models/MarketItem.js';
import User from '../models/User.js';

// GET MARKET ITEMS FROM DATABASE
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

    // Build database query
    const where = { status: 'active' };
    
    if (category) where.category = category;
    if (organic !== undefined) where.organic = organic === 'true';
    if (qualityGrade) where.qualityGrade = qualityGrade;
    
    if (minPrice || maxPrice) {
      where.price = {};
      if (minPrice) where.price[Sequelize.Op.gte] = Number(minPrice);
      if (maxPrice) where.price[Sequelize.Op.lte] = Number(maxPrice);
    }
    
    // For location search, we would need a more complex query
    // This is a simplified version
    if (search) {
      where[Sequelize.Op.or] = [
        { title: { [Sequelize.Op.like]: `%${search}%` } },
        { description: { [Sequelize.Op.like]: `%${search}%` } }
      ];
    }

    // Database query
    const { count, rows: items } = await MarketItem.findAndCountAll({
      where,
      include: [{
        model: User,
        as: 'seller',
        attributes: ['name', 'profile', 'phone']
      }],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });

    res.status(200).json({
      success: true,
      data: items,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: count,
        pages: Math.ceil(count / limit)
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

// GET SINGLE MARKET ITEM
export const getMarketItem = async (req, res) => {
  try {
    console.log('Fetching market item with ID:', req.params.id);
    
    // First, let's try to find all items to see what's in the database
    const allItems = await MarketItem.findAll();
    console.log('All items in database:', allItems.map(item => item.id));
    
    const item = await MarketItem.findByPk(req.params.id, {
      include: [{
        model: User,
        as: 'seller',
        attributes: ['name', 'profile', 'phone']
      }]
    });

    console.log('Found item:', item);

    if (!item) {
      console.log('Item not found in database');
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

// CREATE MARKET ITEM IN DATABASE
export const createMarketItem = async (req, res) => {
  try {
    console.log('Creating market item with request body:', req.body);
    console.log('User ID:', req.user.id);
    
    // Prepare location data
    const locationData = {};
    if (req.body.location) {
      if (req.body.location.city) locationData['location.city'] = req.body.location.city;
      if (req.body.location.state) locationData['location.state'] = req.body.location.state;
      if (req.body.location.pincode) locationData['location.pincode'] = req.body.location.pincode;
    }
    
    // Prepare tags data
    let tagsData = req.body.tags;
    if (typeof tagsData === 'string') {
      try {
        tagsData = JSON.parse(tagsData);
      } catch (e) {
        tagsData = tagsData ? tagsData.split(',') : [];
      }
    }
    
    // Prepare images data
    let imagesData = req.body.images;
    if (typeof imagesData === 'string') {
      try {
        imagesData = JSON.parse(imagesData);
      } catch (e) {
        imagesData = [];
      }
    }

    const marketItemData = {
      sellerId: req.user.id,
      title: req.body.title,
      description: req.body.description,
      price: req.body.price,
      unit: req.body.unit,
      quantity: req.body.quantity,
      category: req.body.category,
      qualityGrade: req.body.qualityGrade,
      organic: req.body.organic,
      harvestDate: req.body.harvestDate,
      status: req.body.status || 'active',
      tags: tagsData,
      images: imagesData,
      ...locationData
    };

    console.log('Creating market item with data:', marketItemData);
    const marketItem = await MarketItem.create(marketItemData);
    console.log('Market item created successfully:', marketItem);

    // Fetch the created item with seller info
    const populatedItem = await MarketItem.findByPk(marketItem.id, {
      include: [{
        model: User,
        as: 'seller',
        attributes: ['name', 'profile']
      }]
    });

    res.status(201).json({
      success: true,
      data: populatedItem
    });
  } catch (error) {
    console.error('Create Market Item Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating market item in database',
      error: error.message
    });
  }
};

// UPDATE MARKET ITEM
export const updateMarketItem = async (req, res) => {
  try {
    let marketItem = await MarketItem.findByPk(req.params.id);

    if (!marketItem) {
      return res.status(404).json({
        success: false,
        message: 'Market item not found'
      });
    }

    // Check ownership
    if (marketItem.sellerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this item'
      });
    }

    // Prepare update data
    const updateData = { ...req.body };
    
    // Handle location data
    if (req.body.location) {
      if (req.body.location.city) updateData['location.city'] = req.body.location.city;
      if (req.body.location.state) updateData['location.state'] = req.body.location.state;
      if (req.body.location.pincode) updateData['location.pincode'] = req.body.location.pincode;
      delete updateData.location;
    }
    
    // Handle tags data
    if (req.body.tags && typeof req.body.tags === 'string') {
      try {
        updateData.tags = JSON.parse(req.body.tags);
      } catch (e) {
        updateData.tags = req.body.tags ? req.body.tags.split(',') : [];
      }
    }
    
    // Handle images data
    if (req.body.images && typeof req.body.images === 'string') {
      try {
        updateData.images = JSON.parse(req.body.images);
      } catch (e) {
        updateData.images = [];
      }
    }

    await marketItem.update(updateData);

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
    const marketItem = await MarketItem.findByPk(req.params.id);

    if (!marketItem) {
      return res.status(404).json({
        success: false,
        message: 'Market item not found'
      });
    }

    // Check ownership
    if (marketItem.sellerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this item'
      });
    }

    await marketItem.destroy();

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
    const items = await MarketItem.findAll({
      where: { sellerId: req.user.id },
      order: [['createdAt', 'DESC']]
    });

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