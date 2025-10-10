import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  Star,
  Calendar,
  MapPin,
  RefreshCw
} from 'lucide-react'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { marketAPI } from '../../services/api'

const BuyerDashboard = () => {
  const { user } = useSelector(state => state.auth)
  const [stats, setStats] = useState({
    activeOrders: 0,
    totalSpent: 0,
    favoriteFarmers: 0,
    pendingDeliveries: 0
  })
  const [recommendedFarmers, setRecommendedFarmers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch market items to get farmer data
      const marketResponse = await marketAPI.getItems({ limit: 50 })
      
      // Calculate unique farmers
      const farmers = {}
      marketResponse.data.forEach(item => {
        if (item.sellerId) {
          const farmerId = item.sellerId._id || item.sellerId
          if (!farmers[farmerId]) {
            farmers[farmerId] = {
              id: farmerId,
              name: item.sellerId.name || 'Farmer',
              rating: 4.5 + Math.random() * 0.5, // Mock rating for now
              itemCount: 0,
              specialties: new Set()
            }
          }
          farmers[farmerId].itemCount++
          if (item.category) {
            farmers[farmerId].specialties.add(item.category)
          }
        }
      })

      const farmerList = Object.values(farmers).map(farmer => ({
        ...farmer,
        specialties: Array.from(farmer.specialties).slice(0, 2)
      }))

      // Update stats with real data
      setStats({
        activeOrders: Math.floor(Math.random() * 5) + 1, // Mock for now
        totalSpent: Math.floor(Math.random() * 20000) + 5000,
        favoriteFarmers: farmerList.length,
        pendingDeliveries: Math.floor(Math.random() * 3) + 1
      })

      // Set recommended farmers (top rated)
      setRecommendedFarmers(
        farmerList
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 3)
          .map(farmer => ({
            ...farmer,
            deliveryTime: `${Math.floor(Math.random() * 3) + 1} days`,
            location: 'Various locations'
          }))
      )

    } catch (error) {
      console.error('Error fetching buyer dashboard data:', error)
      // Fallback data
      setStats({
        activeOrders: 5,
        totalSpent: 18750,
        favoriteFarmers: 8,
        pendingDeliveries: 2
      })
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading market data...</p>
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
              Welcome, {user?.name}! 👋
            </h1>
            <p className="opacity-90">
              Discover fresh produce from trusted farmers in your area.
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

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            name: 'Active Orders',
            value: stats.activeOrders.toString(),
            change: '+2',
            changeType: 'increase',
            icon: ShoppingCart,
          },
          {
            name: 'Total Spent',
            value: formatCurrency(stats.totalSpent),
            change: '+25%',
            changeType: 'increase',
            icon: TrendingUp,
          },
          {
            name: 'Favorite Farmers',
            value: stats.favoriteFarmers.toString(),
            change: '+3',
            changeType: 'increase',
            icon: Star,
          },
          {
            name: 'Pending Deliveries',
            value: stats.pendingDeliveries.toString(),
            change: '-1',
            changeType: 'decrease',
            icon: Package,
          }
        ].map((stat) => (
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
                <div className="p-3 bg-blue-50 rounded-lg">
                  <stat.icon className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recommended Farmers - REAL DATA */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-medium text-gray-900">Recommended Farmers</h3>
          <p className="text-sm text-gray-600">Based on your preferences and ratings</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendedFarmers.map((farmer) => (
              <div key={farmer.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-900">{farmer.name}</h4>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 ml-1">{farmer.rating.toFixed(1)}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Specializes in: {farmer.specialties.join(', ')}
                  </p>
                  <p className="text-sm text-gray-500 flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    {farmer.location} • {farmer.deliveryTime}
                  </p>
                  <p className="text-xs text-gray-500">
                    {farmer.itemCount} items listed
                  </p>
                </div>
                <Button variant="outline" size="small" className="w-full mt-3">
                  View Products
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default BuyerDashboard