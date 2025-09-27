import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { 
  BarChart3, 
  Upload, 
  ShoppingCart, 
  TrendingUp, 
  AlertTriangle,
  Calendar
} from 'lucide-react'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'

const FarmerDashboard = () => {
  const { user } = useSelector(state => state.auth)

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
      link: '/marketplace/create',
      color: 'secondary',
    },
    {
      title: 'View Orders',
      description: 'Check your recent orders',
      icon: Calendar,
      link: '/orders',
      color: 'primary',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-primary-100 mt-2">
          Here's what's happening with your farm today.
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
                <div className="p-3 bg-primary-50 rounded-lg">
                  <stat.icon className="h-6 w-6 text-primary-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.map((action) => (
          <Card key={action.title} className="hover:shadow-md transition-shadow duration-200">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg bg-${action.color}-50`}>
                  <action.icon className={`h-6 w-6 text-${action.color}-600`} />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{action.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{action.description}</p>
                </div>
              </div>
              <Link to={action.link} className="block mt-4">
                <Button variant={action.color} size="small" className="w-full">
                  Get Started
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Activity items would be mapped here */}
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div>
                <p className="text-sm font-medium">New diagnosis completed</p>
                <p className="text-xs text-gray-500">Tomato leaf - Early Blight detected</p>
              </div>
              <span className="text-xs text-gray-400 ml-auto">2 hours ago</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default FarmerDashboard