import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from "react-redux";

import { 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  Star,
  Calendar,
  MapPin
} from 'lucide-react'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'

const BuyerDashboard = () => {
  const { user } = useSelector(state => state.auth)

  const stats = [
    {
      name: 'Active Orders',
      value: '5',
      change: '+2',
      changeType: 'increase',
      icon: ShoppingCart,
    },
    {
      name: 'Total Spent',
      value: '₹18,750',
      change: '+25%',
      changeType: 'increase',
      icon: TrendingUp,
    },
    {
      name: 'Favorite Farmers',
      value: '8',
      change: '+3',
      changeType: 'increase',
      icon: Star,
    },
    {
      name: 'Pending Deliveries',
      value: '2',
      change: '-1',
      changeType: 'decrease',
      icon: Package,
    },
  ]

  const recentOrders = [
    {
      id: 1,
      product: 'Organic Tomatoes',
      farmer: 'Rajesh Kumar',
      quantity: '20 kg',
      price: '₹800',
      status: 'delivered',
      date: '2024-01-15',
      rating: 4.8
    },
    {
      id: 2,
      product: 'Basmati Rice',
      farmer: 'Simran Singh',
      quantity: '50 kg',
      price: '₹4,250',
      status: 'in-transit',
      date: '2024-01-14',
      rating: 4.9
    }
  ]

  const recommendedFarmers = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      specialty: 'Vegetables',
      location: 'Pune, Maharashtra',
      rating: 4.8,
      deliveryTime: '2 days',
      image: '/api/placeholder/80/80'
    },
    {
      id: 2,
      name: 'Priya Patel',
      specialty: 'Fruits',
      location: 'Nashik, Maharashtra',
      rating: 4.9,
      deliveryTime: '1 day',
      image: '/api/placeholder/80/80'
    }
  ]

  const getStatusColor = (status) => {
    const colors = {
      'delivered': 'text-green-600 bg-green-50',
      'in-transit': 'text-blue-600 bg-blue-50',
      'pending': 'text-yellow-600 bg-yellow-50',
      'cancelled': 'text-red-600 bg-red-50'
    }
    return colors[status] || 'text-gray-600 bg-gray-50'
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold">
          Welcome, {user?.name}!
        </h1>
        <p className="text-primary-100 mt-2">
          Discover fresh produce from trusted farmers.
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
            <Link to="/orders">
              <Button variant="outline" size="small">View All</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Package className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{order.product}</p>
                      <p className="text-sm text-gray-500">by {order.farmer}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <p className="text-sm font-medium text-gray-900 mt-1">{order.price}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recommended Farmers */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-medium text-gray-900">Recommended Farmers</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recommendedFarmers.map((farmer) => (
                <div key={farmer.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <img
                    src={farmer.image}
                    alt={farmer.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-900">{farmer.name}</h4>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">{farmer.rating}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{farmer.specialty}</p>
                    <div className="flex items-center text-xs text-gray-500 mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      {farmer.location} • {farmer.deliveryTime}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/marketplace">
              <Button variant="outline" className="w-full h-16 flex-col">
                <ShoppingCart className="h-6 w-6 mb-2" />
                Browse Marketplace
              </Button>
            </Link>
            <Link to="/orders">
              <Button variant="outline" className="w-full h-16 flex-col">
                <Package className="h-6 w-6 mb-2" />
                View Orders
              </Button>
            </Link>
            <Link to="/chat">
              <Button variant="outline" className="w-full h-16 flex-col">
                <MessageSquare className="h-6 w-6 mb-2" />
                Chat Support
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default BuyerDashboard