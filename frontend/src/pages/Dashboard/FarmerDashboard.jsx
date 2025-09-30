import React, { useEffect } from 'react'
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
  Leaf
} from 'lucide-react'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'

const FarmerDashboard = () => {
  const { user } = useSelector(state => state.auth)
  const dispatch = useDispatch()

  const stats = [
    {
      name: 'Active Listings',
      value: '12',
      change: '+2',
      changeType: 'increase',
      icon: ShoppingCart,
    },
    {
      name: 'Diagnoses This Month',
      value: '8',
      change: '+3',
      changeType: 'increase',
      icon: BarChart3,
    },
    {
      name: 'Total Revenue',
      value: '₹24,500',
      change: '+12%',
      changeType: 'increase',
      icon: TrendingUp,
    },
    {
      name: 'Pending Alerts',
      value: '3',
      change: '-1',
      changeType: 'decrease',
      icon: AlertTriangle,
    },
  ]

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
      link: '/marketplace',
      color: 'secondary',
    },
    {
      title: 'View Orders',
      description: 'Check your recent orders',
      icon: Package,
      link: '/marketplace/my',
      color: 'primary',
    },
  ]

  const recentActivity = [
    {
      type: 'diagnosis',
      message: 'Tomato leaf - Early Blight detected',
      time: '2 hours ago',
      status: 'completed'
    },
    {
      type: 'sale',
      message: 'Sold 50kg Wheat to Green Farms',
      time: '1 day ago',
      status: 'completed'
    },
    {
      type: 'alert',
      message: 'Weather alert: Heavy rain expected',
      time: '3 days ago',
      status: 'pending'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="opacity-90">
          Here's what's happening with your farm today. You have 3 tasks pending.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name} className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className={`text-sm mt-1 ${
                    stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change} from last month
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.map((action) => (
          <Card key={action.title} className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-xl bg-${action.color}-50`}>
                  <action.icon className={`h-8 w-8 text-${action.color}-600`} />
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
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
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
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Crop Health Overview */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-gray-900">Crop Health Overview</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { crop: 'Tomatoes', health: 'Good', issues: 0, progress: 90 },
                { crop: 'Wheat', health: 'Warning', issues: 2, progress: 65 },
                { crop: 'Corn', health: 'Good', issues: 0, progress: 85 }
              ].map((crop, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Leaf className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium text-gray-900">{crop.crop}</p>
                      <p className={`text-sm ${
                        crop.health === 'Good' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {crop.health} • {crop.issues} issues
                      </p>
                    </div>
                  </div>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        crop.progress > 80 ? 'bg-green-500' : 'bg-yellow-500'
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