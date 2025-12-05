import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Search, Filter, MapPin, Star, Leaf, Plus } from 'lucide-react'
import Button from '../../components/ui/Button'
import { fetchMarketItems } from '../../store/slices/marketSlice'

const MarketList = () => {
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { items, loading } = useSelector(state => state.market)

  // 1. Local state to hold search/filter values
  const [filters, setFilters] = useState({
    search: '',
    category: ''
  })

  // 2. Fetch items whenever filters change (with a 500ms delay for typing)
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(fetchMarketItems(filters))
    }, 500)
    return () => clearTimeout(timer)
  }, [dispatch, filters])

  // Handlers for inputs
  const handleSearchChange = (e) => {
    setFilters(prev => ({ ...prev, search: e.target.value }))
  }

  const handleCategoryChange = (e) => {
    setFilters(prev => ({ ...prev, category: e.target.value }))
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between bg-gradient-to-r from-green-600 to-emerald-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold">Marketplace</h1>
          <p className="text-green-50 mt-2 text-lg">
            Buy fresh produce directly from trusted farmers
          </p>
        </div>
        {user?.role === 'farmer' && (
          <Link to="/marketplace/create" className="relative z-10 mt-4 lg:mt-0">
            <Button className="bg-white text-green-700 hover:bg-green-50 border-none shadow-lg">
              <Plus className="h-4 w-4 mr-2" />
              Sell Produce
            </Button>
          </Link>
        )}
      </div>

      {/* Search and Filters */}
      <div className="glass p-6 rounded-2xl dark:bg-gray-800/50">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={filters.search}
                onChange={handleSearchChange}
                placeholder="Search for crops, locations, farmers..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 bg-white/50 dark:bg-gray-800 dark:text-white"
              />
            </div>
          </div>
          
          <select 
            value={filters.category}
            onChange={handleCategoryChange}
            className="px-3 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 bg-white/50 dark:bg-gray-800 dark:text-white cursor-pointer"
          >
            <option value="">All Categories</option>
            <option value="Vegetables">Vegetables</option>
            <option value="Fruits">Fruits</option>
            <option value="Cereals">Cereals</option>
            <option value="Pulses">Pulses</option>
          </select>
          
          <Button variant="outline" onClick={() => setFilters({ search: '', category: '' })}>
            <Filter className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="flex justify-center h-64 items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.length > 0 ? items.map((item) => (
            <div key={item.id} className="glass rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 dark:bg-gray-800/50">
              <div className="relative h-56 overflow-hidden">
                <img
                  src={item.images?.[0]?.url || '/images/placeholder.jpg'}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-4 left-4 right-4">
                  <Link to={`/marketplace/${item.id}`}>
                    <Button className="w-full bg-white/90 text-green-700 hover:bg-white shadow-lg border-none">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">{item.title}</h3>
                  <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-lg">
                    Grade {item.qualityGrade}
                  </span>
                </div>
                
                {/* 3. FIX: Handle both location_city (DB) and location.city (Old Format) */}
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <MapPin className="h-4 w-4 mr-1 text-red-400" />
                  {item.location_city || item.location?.city}, {item.location_state || item.location?.state}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex flex-col">
                    <span className="text-xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(item.price)}
                    </span>
                    <span className="text-sm text-gray-500">/{item.unit}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-sm text-gray-600 mr-2">{item.seller?.name}</span>
                    <Star className="h-3 w-3 text-yellow-400 fill-current" />
                    <span className="text-xs font-bold text-gray-700 ml-1">
                      {item.seller?.rating || 4.5}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full text-center py-10 text-gray-500">
              No items found. Try changing your search filters.
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default MarketList