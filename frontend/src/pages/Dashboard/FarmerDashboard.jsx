import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { 
  BarChart3, 
  Upload, 
  ShoppingCart, 
  TrendingUp, 
  AlertTriangle,
  Calendar,
  Package,
  Leaf,
  RefreshCw
} from 'lucide-react'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { dashboardAPI } from '../../services/api'

const FarmerDashboard = () => {
  const { user } = useSelector(state => state.auth)
  const [stats, setStats] = useState({
    activeListings: 0,
    diagnosesThisMonth: 0,
    totalRevenue: 0,
    pendingAlerts: 0
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [cropHealth, setCropHealth] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch REAL data from dashboard APIs
      const [statsResponse, activityResponse, healthResponse] = await Promise.all([
        dashboardAPI.getFarmerStats(),
        dashboardAPI.getRecentActivity(),
        dashboardAPI.getCropHealth()
      ]);

      console.log('Real Dashboard Data:', {
        stats: statsResponse.data,
        activity: activityResponse.data,
        health: healthResponse.data
      });

      // Update stats with REAL data from API
      setStats({
        activeListings: statsResponse.data.activeListings || 0,
        diagnosesThisMonth: statsResponse.data.diagnosesThisMonth || 0,
        totalRevenue: statsResponse.data.totalRevenue || 0,
        pendingAlerts: statsResponse.data.pendingAlerts || 0
      });

      // Set recent activity from REAL data
      setRecentActivity(activityResponse.data || []);

      // Set crop health from REAL data
      setCropHealth(healthResponse.data || []);

    } catch (error) {
      console.error('Error fetching REAL dashboard data:', error);
      // Fallback to prevent complete failure
      setStats({
        activeListings: 0,
        diagnosesThisMonth: 0,
        totalRevenue: 0,
        pendingAlerts: 0
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
      title: 'Diagnose Crop Disease',
      description: 'Upload leaf image for disease detection',
      icon: Upload,
      link: '/diagnose',
      color: 'primary',
    },
    {
      title: 'Sell Produce',
      description: 'List your crops in marketplace',
      icon: ShoppingCart,
      link: '/marketplace/create',
      color: 'secondary',
    },
    {
      title: 'View My Listings',
      description: 'Check your active listings',
      icon: Package,
      link: '/marketplace/my',
      color: 'primary',
    },
    {
      title: 'Manage Orders',
      description: 'View and manage customer orders',
      icon: ShoppingCart,
      link: '/marketplace/orders',
      color: 'secondary',
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading real farm data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="opacity-90">
              Here's your farm overview with <strong>REAL-TIME DATA</strong> from your activities.
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
            name: 'Active Listings',
            value: stats.activeListings.toString(),
            change: 'Real Data',
            changeType: 'increase',
            icon: ShoppingCart,
            description: 'Your marketplace items'
          },
          {
            name: 'Diagnoses This Month',
            value: stats.diagnosesThisMonth.toString(),
            change: 'Real Data',
            changeType: 'increase',
            icon: BarChart3,
            description: 'Crop health checks'
          },
          {
            name: 'Estimated Revenue',
            value: formatCurrency(stats.totalRevenue),
            change: 'Real Data',
            changeType: 'increase',
            icon: TrendingUp,
            description: 'From your farm'
          },
          {
            name: 'Pending Tasks',
            value: stats.pendingAlerts.toString(),
            change: 'Real Data',
            changeType: 'decrease',
            icon: AlertTriangle,
            description: 'Need attention'
          }
        ].map((stat) => (
          <Card key={stat.name} className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className="text-sm text-gray-500 mt-1">{stat.description}</p>
                  <p className="text-sm text-green-600 mt-1 font-medium">
                    📊 Live Data
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <stat.icon className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action) => (
          <Card key={action.title} className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl ${
                  action.color === 'primary' ? 'bg-green-50' : 'bg-yellow-50'
                }`}>
                  <action.icon className={`h-8 w-8 ${
                    action.color === 'primary' ? 'text-green-600' : 'text-yellow-600'
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
            <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded font-medium">
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
                  <p className="text-sm text-gray-400 mt-1">Start by listing products or diagnosing crops</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Crop Health Overview - REAL DATA */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Crop Health Overview</h3>
            <span className="text-sm text-green-600 bg-green-100 px-2 py-1 rounded font-medium">
              Real Data
            </span>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {cropHealth.map((crop, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Leaf className={`h-5 w-5 ${
                      crop.health === 'Good' ? 'text-green-500' : 
                      crop.health === 'Warning' ? 'text-yellow-500' : 'text-red-500'
                    }`} />
                    <div>
                      <p className="font-medium text-gray-900">{crop.crop}</p>
                      <p className={`text-sm ${
                        crop.health === 'Good' ? 'text-green-600' : 
                        crop.health === 'Warning' ? 'text-yellow-600' : 'text-red-600'
                      }`}>
                        {crop.health} • {crop.issues} issues
                      </p>
                    </div>
                  </div>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        crop.progress > 80 ? 'bg-green-500' : 
                        crop.progress > 60 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${crop.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default FarmerDashboard