import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { 
  BarChart3, 
  ShoppingCart, 
  TrendingUp, 
  Package,
  Leaf,
  RefreshCw,
  MapPin,
  Star
} from 'lucide-react'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { dashboardAPI } from '../../services/api'

const BuyerDashboard = () => {
  const { user } = useSelector(state => state.auth)
  const [stats, setStats] = useState({
    activeOrders: 0,
    totalSpent: 0,
    favoriteFarmers: 0,
    pendingDeliveries: 0
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [recommendedFarmers, setRecommendedFarmers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch REAL data from dashboard APIs
      const [statsResponse, activityResponse, farmersResponse] = await Promise.all([
        dashboardAPI.getBuyerStats(),
        dashboardAPI.getRecentActivity(),
        dashboardAPI.getRecommendedFarmers()
      ]);

      console.log('Real Dashboard Data:', {
        stats: statsResponse.data,
        activity: activityResponse.data,
        farmers: farmersResponse.data
      });

      // Update stats with REAL data from API
      setStats({
        activeOrders: statsResponse.data.activeOrders || 0,
        totalSpent: statsResponse.data.totalSpent || 0,
        favoriteFarmers: statsResponse.data.favoriteFarmers || 0,
        pendingDeliveries: statsResponse.data.pendingDeliveries || 0
      });

      // Set recent activity from REAL data
      setRecentActivity(activityResponse.data || []);

      // Set recommended farmers from REAL data
      setRecommendedFarmers(farmersResponse.data || []);

    } catch (error) {
      console.error('Error fetching REAL dashboard data:', error);
      // Fallback to prevent complete failure
      setStats({
        activeOrders: 0,
        totalSpent: 0,
        favoriteFarmers: 0,
        pendingDeliveries: 0
      });
    } finally {
      setLoading(false);
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const quickActions = [
    {
      title: 'Browse Marketplace',
      description: 'Discover fresh produce from local farmers',
      icon: ShoppingCart,
      link: '/marketplace',
      color: 'primary',
    },
    {
      title: 'My Orders',
      description: 'Track your recent purchases',
      icon: Package,
      link: '/orders',
      color: 'secondary',
    },
    {
      title: 'Find Farmers',
      description: 'Connect with trusted local farmers',
      icon: Leaf,
      link: '/marketplace',
      color: 'primary',
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="opacity-90">
              Here's your shopping overview with <strong>REAL-TIME DATA</strong> from your activities.
            </p>
          </div>
          <Button 
            variant="outline" 
            size="small" 
            onClick={fetchDashboardData}
            className="bg-white/20 hover:bg-white/30 text-white border-white/30"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Grid - REAL DATA */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            name: 'Active Orders',
            value: stats.activeOrders.toString(),
            change: 'Real Data',
            changeType: 'increase',
            icon: Package,
            description: 'Currently processing'
          },
          {
            name: 'Total Spent',
            value: formatCurrency(stats.totalSpent),
            change: 'Real Data',
            changeType: 'increase',
            icon: TrendingUp,
            description: 'This season'
          },
          {
            name: 'Favorite Farmers',
            value: stats.favoriteFarmers.toString(),
            change: 'Real Data',
            changeType: 'increase',
            icon: Leaf,
            description: 'You follow'
          },
          {
            name: 'Pending Deliveries',
            value: stats.pendingDeliveries.toString(),
            change: 'Real Data',
            changeType: 'decrease',
            icon: ShoppingCart,
            description: 'In transit'
          }
        ].map((stat) => (
          <Card key={stat.name} className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{stat.description}</p>
                  <p className="text-sm text-blue-600 mt-1 font-medium">
                    📊 Live Data
                  </p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <stat.icon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.map((action) => (
          <Card key={action.title} className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl ${
                  action.color === 'primary' ? 'bg-blue-50' : 'bg-yellow-50'
                }`}>
                  <action.icon className={`h-8 w-8 ${
                    action.color === 'primary' ? 'text-blue-600' : 'text-yellow-600'
                  }`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-lg">{action.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                </div>
              </div>
              <Link to={action.link} className="block mt-4">
                <Button variant={action.color} size="medium" className="w-full">
                  Get Started
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity - REAL DATA */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
            <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded font-medium">
              Real Data
            </span>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length > 0 ? recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-3 h-3 rounded-full ${
                    activity.status === 'completed' ? 'bg-green-500' : 
                    activity.status === 'pending' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No recent activity yet</p>
                  <p className="text-sm text-gray-400 mt-1">Start by browsing the marketplace</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recommended Farmers - REAL DATA */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Recommended Farmers</h3>
            <span className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded font-medium">
              Real Data
            </span>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendedFarmers.length > 0 ? recommendedFarmers.map((farmer, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-800 font-bold">
                        {farmer.name?.charAt(0) || 'F'}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{farmer.name}</p>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                        <span>{farmer.rating || 4.5}</span>
                        <span className="mx-2">•</span>
                        <span>{farmer.itemCount || 0} items</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="small">
                    View
                  </Button>
                </div>
              )) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No recommended farmers yet</p>
                  <p className="text-sm text-gray-400 mt-1">Explore the marketplace to find farmers</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default BuyerDashboard