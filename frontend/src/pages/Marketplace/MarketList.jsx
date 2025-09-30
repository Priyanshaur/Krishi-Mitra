import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Search, Filter, MapPin, Star, Leaf, Plus } from 'lucide-react'
import { Card, CardContent } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { fetchMarketItems } from '../../store/slices/marketSlice'

const MarketList = () => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { items, loading } = useSelector(state => state.market)

  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    location: '',
    organic: false
  })

  useEffect(() => {
    dispatch(fetchMarketItems())
  }, [dispatch])

  const marketItems = [
    {
      id: 1,
      title: 'Organic Tomatoes - Premium Quality',
      price: 45,
      unit: 'kg',
      quantity: 100,
      category: 'vegetables',
      organic: true,
      qualityGrade: 'premium',
      location: 'Pune, Maharashtra',
      image: 'https://images.unsplash.com/photo-1546470427-e212b7d31079?w=300&h=200&fit=crop',
      seller: { name: 'Rajesh Kumar', rating: 4.8 }
    },
    {
      id: 2,
      title: 'Basmati Rice - Grade A',
      price: 85,
      unit: 'kg',
      quantity: 500,
      category: 'cereals',
      organic: false,
      qualityGrade: 'grade-a',
      location: 'Amritsar, Punjab',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&h=200&fit=crop',
      seller: { name: 'Simran Singh', rating: 4.9 }
    }
  ]

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Marketplace</h1>
          <p className="text-gray-600 mt-2">
            Buy fresh produce directly from trusted farmers
          </p>
        </div>
        {user?.role === 'farmer' && (
          <Link to="/marketplace/create">
            <Button variant="primary">
              <Plus className="h-4 w-4 mr-2" />
              Sell Produce
            </Button>
          </Link>
        )}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search for crops, locations, farmers..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500">
              <option>All Categories</option>
              <option value="vegetables">Vegetables</option>
              <option value="fruits">Fruits</option>
              <option value="cereals">Cereals</option>
              <option value="pulses">Pulses</option>
            </select>
            <Button variant="outline" className="flex items-center justify-center">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {marketItems.map(item => (
          <Card key={item.id} className="hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="relative">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              {item.organic && (
                <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
                  <Leaf className="h-3 w-3 mr-1" />
                  Organic
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1">{item.title}</h3>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full ml-2">
                  {item.qualityGrade}
                </span>
              </div>
              
              <div className="flex items-center text-sm text-gray-600 mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                {item.location}
              </div>
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                  <span className="text-sm text-gray-600 ml-1">{item.seller.rating}</span>
                  <span className="text-sm text-gray-400 ml-1">• {item.seller.name}</span>
                </div>
                <span className="text-sm text-gray-600">Qty: {item.quantity}{item.unit}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-gray-900">₹{item.price}</span>
                  <span className="text-gray-600">/{item.unit}</span>
                </div>
                <Button variant="primary" size="small">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default MarketList