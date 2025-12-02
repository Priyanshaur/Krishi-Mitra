import { Op, Sequelize } from 'sequelize';
import MarketItem from '../models/MarketItem.js';
import Diagnosis from '../models/Diagnose.js';
import Order from '../models/Order.js';
import User from '../models/User.js';

// GET FARMER DASHBOARD STATS
export const getFarmerStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const startOfMonth = new Date(currentYear, currentMonth, 1);

    console.log('Fetching farmer stats for user:', userId);

    // 1. Get active listings count
    const activeListings = await MarketItem.count({
      where: {
        sellerId: userId,
        status: 'active'
      }
    });

    // 2. Get diagnoses this month
    const diagnosesThisMonth = await Diagnosis.count({
      where: {
        userId: userId,
        createdAt: { [Op.gte]: startOfMonth }
      }
    });

    // 3. Calculate total revenue (Using fallback for now as Orders might be empty)
    let totalRevenue = 0;
    try {
      // Try fetching from Orders table first
      const revenueData = await Order.findAll({
        attributes: [
          [Sequelize.fn('SUM', Sequelize.col('totalAmount')), 'totalRevenue']
        ],
        where: {
          sellerId: userId,
          paymentStatus: 'paid'
        },
        raw: true
      });
      
      if (revenueData && revenueData[0] && revenueData[0].totalRevenue) {
        totalRevenue = parseFloat(revenueData[0].totalRevenue);
      } else {
        // Fallback: Estimate based on MarketItems if no orders yet
        const marketItems = await MarketItem.findAll({ where: { sellerId: userId } });
        totalRevenue = marketItems.reduce((total, item) => {
          const price = parseFloat(item.price) || 0;
          const qty = parseInt(item.quantity) || 0;
          return total + (price * qty * 0.3); // Estimate 30% sold
        }, 0);
      }
    } catch (error) {
      console.log('Revenue calculation error:', error.message);
    }

    // 4. Get pending alerts
    const pendingAlerts = await MarketItem.count({
      where: {
        sellerId: userId,
        [Op.or]: [
          { quantity: { [Op.lt]: 10 } },
          { status: { [Op.ne]: 'active' } }
        ]
      }
    });

    res.status(200).json({
      success: true,
      data: {
        activeListings,
        diagnosesThisMonth,
        totalRevenue: Math.round(totalRevenue),
        pendingAlerts
      }
    });
  } catch (error) {
    console.error('Get Farmer Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching farmer dashboard statistics'
    });
  }
};

// GET BUYER DASHBOARD STATS
export const getBuyerStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Get active orders count
    const activeOrders = await Order.count({
      where: {
        buyerId: userId,
        status: { [Op.in]: ['pending', 'confirmed', 'shipped'] }
      }
    });

    // 2. Calculate total spent & other stats
    let totalSpent = 0;
    let favoriteFarmers = 0;
    let pendingDeliveries = 0;

    const spendingData = await Order.findAll({
      attributes: [
        [Sequelize.fn('SUM', Sequelize.col('totalAmount')), 'totalSpent']
      ],
      where: {
        buyerId: userId,
        paymentStatus: 'paid'
      },
      raw: true
    });

    if (spendingData && spendingData[0] && spendingData[0].totalSpent) {
      totalSpent = parseFloat(spendingData[0].totalSpent);
    }

    // Count unique sellers (favorite farmers)
    const uniqueFarmers = await Order.findAll({
      attributes: [
        [Sequelize.fn('DISTINCT', Sequelize.col('sellerId')), 'sellerId']
      ],
      where: { buyerId: userId }
    });
    favoriteFarmers = uniqueFarmers.length;

    // Count pending deliveries
    pendingDeliveries = await Order.count({
      where: {
        buyerId: userId,
        status: { [Op.in]: ['confirmed', 'shipped'] }
      }
    });

    res.status(200).json({
      success: true,
      data: {
        activeOrders,
        totalSpent,
        favoriteFarmers,
        pendingDeliveries
      }
    });
  } catch (error) {
    console.error('Get Buyer Stats Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching buyer dashboard statistics'
    });
  }
};

// GET RECENT ACTIVITY
export const getRecentActivity = async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;
    let activity = [];

    if (userRole === 'farmer') {
      // Fetch recent diagnoses
      const recentDiagnoses = await Diagnosis.findAll({
        where: { userId: userId },
        order: [['createdAt', 'DESC']],
        limit: 3
      });

      // Fetch recent listings
      const recentListings = await MarketItem.findAll({
        where: { sellerId: userId },
        order: [['createdAt', 'DESC']],
        limit: 2
      });

      activity = [
        ...recentDiagnoses.map(d => ({
          type: 'diagnosis',
          // ✅ FIXED: Using underscore field name
          message: `${d.cropType} - ${d.prediction_disease || 'Analyzed'}`,
          time: d.createdAt,
          status: 'completed'
        })),
        ...recentListings.map(l => ({
          type: 'sale',
          message: `Listed: ${l.title}`,
          time: l.createdAt,
          status: l.status === 'active' ? 'completed' : 'pending'
        }))
      ];
    } else {
      // Buyer Activity: View recent market items or orders
      const recentListings = await MarketItem.findAll({
        order: [['createdAt', 'DESC']],
        limit: 3,
        include: [{
          model: User,
          as: 'seller',
          attributes: ['name']
        }],
        attributes: ['title', 'createdAt', 'price', 'sellerId']
      });

      activity = recentListings.map(item => ({
        type: 'view',
        message: `Viewed: ${item.title} from ${item.seller?.name || 'Unknown Farmer'}`,
        time: item.createdAt,
        status: 'completed'
      }));
    }

    // Sort combined activity
    activity.sort((a, b) => new Date(b.time) - new Date(a.time));
    
    const formattedActivity = activity.map(item => ({
      ...item,
      time: formatTimeAgo(item.time)
    }));

    res.status(200).json({
      success: true,
      data: formattedActivity
    });
  } catch (error) {
    console.error('Get Recent Activity Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recent activity'
    });
  }
};

// GET CROP HEALTH DATA
export const getCropHealth = async (req, res) => {
  try {
    const userId = req.user.id;

    // Fetch all diagnoses for user
    const diagnoses = await Diagnosis.findAll({
      where: { userId: userId },
      attributes: ['cropType', 'severity', 'createdAt', 'prediction_confidence'],
      order: [['createdAt', 'DESC']]
    });

    // Group by crop
    const cropGroups = {};
    diagnoses.forEach(d => {
      if (!cropGroups[d.cropType]) {
        cropGroups[d.cropType] = {
          total: 0,
          critical: 0,
          high: 0,
          confidenceSum: 0,
          lastDiagnosis: d.createdAt
        };
      }
      cropGroups[d.cropType].total++;
      cropGroups[d.cropType].confidenceSum += (d.prediction_confidence || 0);
      
      if (d.severity === 'critical') cropGroups[d.cropType].critical++;
      if (d.severity === 'high') cropGroups[d.cropType].high++;
    });

    // Calculate scores
    const formattedHealth = Object.keys(cropGroups).map(cropName => {
      const data = cropGroups[cropName];
      const issuesScore = (data.critical * 5) + (data.high * 3);
      // Base health on issues, clamped between 0 and 100
      const healthScore = Math.max(0, Math.min(100, 100 - (issuesScore * 10)));
      
      let healthStatus = 'Good';
      let issuesCount = 0;

      if (healthScore < 40) {
        healthStatus = 'Critical';
        issuesCount = data.critical + data.high;
      } else if (healthScore < 70) {
        healthStatus = 'Warning';
        issuesCount = data.high;
      }

      return {
        crop: cropName,
        health: healthStatus,
        issues: issuesCount,
        progress: healthScore
      };
    }).slice(0, 5);

    // Default data if empty
    if (formattedHealth.length === 0) {
      formattedHealth.push(
        { crop: 'Tomatoes', health: 'Good', issues: 0, progress: 90 },
        { crop: 'Wheat', health: 'Warning', issues: 2, progress: 65 },
        { crop: 'Corn', health: 'Good', issues: 0, progress: 85 }
      );
    }

    res.status(200).json({
      success: true,
      data: formattedHealth
    });
  } catch (error) {
    console.error('Get Crop Health Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching crop health data'
    });
  }
};

// GET RECOMMENDED FARMERS
export const getRecommendedFarmers = async (req, res) => {
  try {
    // Basic aggregation for MySQL
    const farmersData = await MarketItem.findAll({
      attributes: [
        'sellerId',
        [Sequelize.fn('COUNT', Sequelize.col('MarketItem.id')), 'itemCount'],
        [Sequelize.fn('SUM', Sequelize.col('quantity')), 'totalQuantity']
      ],
      group: ['sellerId'],
      include: [{
        model: User,
        as: 'seller',
        attributes: ['name', 'rating']
      }],
      order: [[Sequelize.literal('itemCount'), 'DESC']],
      limit: 6
    });

    const formattedFarmers = farmersData.map(item => {
      const seller = item.seller || {};
      const totalQty = parseInt(item.getDataValue('totalQuantity') || 0);
      
      let deliveryTime = '1-2 days';
      if (totalQty >= 1000) deliveryTime = '3-4 days';
      else if (totalQty >= 500) deliveryTime = '2-3 days';

      return {
        name: seller.name || 'Unknown Farmer',
        rating: seller.rating || 4.5,
        itemCount: item.getDataValue('itemCount'),
        specialties: ['General Farming'], 
        totalQuantity: totalQty,
        deliveryTime
      };
    });

    res.status(200).json({
      success: true,
      data: formattedFarmers
    });
  } catch (error) {
    console.error('Get Recommended Farmers Error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recommended farmers'
    });
  }
};

function formatTimeAgo(date) {
  const now = new Date();
  const diffMs = now - new Date(date);
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return new Date(date).toLocaleDateString();
}