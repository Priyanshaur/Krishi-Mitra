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
    <div className="space-y-6 fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-400/20 rounded-full -ml-10 -mb-10 blur-2xl"></div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center relative z-10">
          <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-green-50 text-lg max-w-xl">
              Here's your farm overview with <strong>REAL-TIME DATA</strong> from your activities.
            </p>
          </div>
          <Button
            variant="outline"
            size="small"
            onClick={fetchDashboardData}
            className="mt-4 md:mt-0 bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm transition-all duration-300"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
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
            description: 'Your marketplace items',
            color: 'from-blue-500 to-blue-600'
          },
          {
            name: 'Diagnoses This Month',
            value: stats.diagnosesThisMonth.toString(),
            change: 'Real Data',
            changeType: 'increase',
            icon: BarChart3,
            description: 'Crop health checks',
            color: 'from-green-500 to-green-600'
          },
          {
            name: 'Estimated Revenue',
            value: formatCurrency(stats.totalRevenue),
            change: 'Real Data',
            changeType: 'increase',
            icon: TrendingUp,
            description: 'From your farm',
            color: 'from-emerald-500 to-emerald-600'
          },
          {
            name: 'Pending Tasks',
            value: stats.pendingAlerts.toString(),
            change: 'Real Data',
            changeType: 'decrease',
            icon: AlertTriangle,
            description: 'Need attention',
            color: 'from-orange-500 to-orange-600'
          }
        ].map((stat, index) => (
          <div key={stat.name} className="glass p-6 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1" style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                LIVE
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.name}</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              <p className="text-xs text-gray-400 mt-2">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickActions.map((action, index) => (
          <div key={action.title} className="glass p-6 rounded-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group cursor-pointer" style={{ animationDelay: `${0.4 + (index * 0.1)}s` }}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${action.color === 'primary'
              ? 'bg-green-100 text-green-600'
              : 'bg-yellow-100 text-yellow-600'
              }`}>
              <action.icon className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-gray-900 text-lg mb-2">{action.title}</h3>
            <p className="text-sm text-gray-500 mb-4 h-10">{action.description}</p>
            <Link to={action.link} className="block">
              <Button
                variant={action.color}
                size="medium"
                className="w-full justify-center shadow-md group-hover:shadow-lg transition-all"
              >
                Open
              </Button>
            </Link>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Recent Activity - REAL DATA */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Recent Activity</h3>
            <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
              REAL DATA
            </span>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivity.length > 0 ? recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4 p-4 bg-white rounded-xl border border-gray-100 hover:border-green-200 transition-colors shadow-sm">
                  <div className={`w-3 h-3 rounded-full shadow-sm ${activity.status === 'completed' ? 'bg-green-500' :
                    activity.status === 'pending' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`}></div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{activity.time}</p>
                  </div>
                </div>
              )) : (
                <div className="text-center py-12 bg-gray-50/50 rounded-xl border border-dashed border-gray-200">
                  <p className="text-gray-500 font-medium">No recent activity yet</p>
                  <p className="text-sm text-gray-400 mt-1">Start by listing products or diagnosing crops</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Crop Health Overview - REAL DATA */}
        <div className="glass rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-900">Crop Health Overview</h3>
            <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
              REAL DATA
            </span>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {cropHealth.map((crop, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-4">
                    <div className={`p-2 rounded-lg ${crop.health === 'Good' ? 'bg-green-100 text-green-600' :
                      crop.health === 'Warning' ? 'bg-yellow-100 text-yellow-600' : 'bg-red-100 text-red-600'
                      }`}>
                      <Leaf className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{crop.crop}</p>
                      <p className={`text-xs font-medium ${crop.health === 'Good' ? 'text-green-600' :
                        crop.health === 'Warning' ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                        {crop.health} • {crop.issues} issues
                      </p>
                    </div>
                  </div>
                  <div className="w-24 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${crop.progress > 80 ? 'bg-green-500' :
                        crop.progress > 60 ? 'bg-yellow-500' : 'bg-red-500'
                        }`}
                      style={{ width: `${crop.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FarmerDashboard