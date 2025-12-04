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

  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All Categories')

  // Local state for filtered items
  const [filteredItems, setFilteredItems] = useState([])

  useEffect(() => {
    dispatch(fetchMarketItems())
  }, [dispatch])

  useEffect(() => {
    // Apply filters locally when items, searchTerm, or categoryFilter changes
    if (items) {
      let result = [...items];

      // Filter by search term
      if (searchTerm) {
        const lowerTerm = searchTerm.toLowerCase();
        result = result.filter(item =>
          item.title.toLowerCase().includes(lowerTerm) ||
          item.description?.toLowerCase().includes(lowerTerm) ||
          item.location?.city?.toLowerCase().includes(lowerTerm)
        );
      }

      // Filter by category
      if (categoryFilter !== 'All Categories') {
        result = result.filter(item =>
          item.category.toLowerCase() === categoryFilter.toLowerCase()
        );
      }

      setFilteredItems(result);
    }
  }, [items, searchTerm, categoryFilter]);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading marketplace items...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between bg-gradient-to-r from-green-600 to-emerald-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-400/20 rounded-full -ml-10 -mb-10 blur-2xl"></div>

        <div className="relative z-10">
          <h1 className="text-3xl font-bold">Marketplace</h1>
          <p className="text-green-50 mt-2 text-lg">
            Buy fresh produce directly from trusted farmers
          </p>
        </div>
        {user?.role === 'farmer' && (
          <Link to="/marketplace/create" className="relative z-10 mt-4 lg:mt-0">
            <Button className="bg-white text-green-700 hover:bg-green-50 border-none shadow-lg hover:shadow-xl transition-all">
              <Plus className="h-4 w-4 mr-2" />
              Sell Produce
            </Button>
          </Link>
        )}
      </div>

      {/* Search and Filters */}
      <div className="glass p-6 rounded-2xl dark:bg-gray-800/50 dark:border-gray-700">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <div className="relative group z-0">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500 group-hover:text-green-500 transition-colors" />
              <input
                type="text"
                placeholder="Search for crops, locations, farmers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all bg-white/50 dark:bg-gray-800 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 bg-white/50 dark:bg-gray-800 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 transition-all cursor-pointer text-gray-900 dark:text-white"
          >
            <option>All Categories</option>
            <option value="vegetables">Vegetables</option>
            <option value="fruits">Fruits</option>
            <option value="cereals">Cereals</option>
            <option value="pulses">Pulses</option>
            <option value="spices">Spices</option>
            <option value="others">Others</option>
          </select>
          <Button variant="outline" className="flex items-center justify-center py-3 rounded-xl border-gray-200 dark:border-gray-600 hover:border-green-500 hover:text-green-600 bg-white/50 dark:bg-gray-800 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-700 transition-all text-gray-700 dark:text-gray-300">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>
      </div>

      {/* Products Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item, index) => (
            <div key={item.id} className="glass rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group dark:bg-gray-800/50 dark:border-gray-700" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="relative h-56 overflow-hidden">
                {item.images && item.images.length > 0 ? (
                  <img
                    src={item.images[0].url}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                    <Leaf className="h-12 w-12 text-gray-300 dark:text-gray-500" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                {item.organic && (
                  <div className="absolute top-4 left-4 bg-green-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-lg">
                    <Leaf className="h-3 w-3 mr-1" />
                    Organic
                  </div>
                )}

                <div className="absolute bottom-4 left-4 right-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <Link to={`/marketplace/${item.id}`}>
                    <Button className="w-full bg-white/90 hover:bg-white text-green-700 backdrop-blur-sm shadow-lg border-none">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1 text-lg group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">{item.title}</h3>
                  <span className={`text-xs font-bold px-2 py-1 rounded-lg ${item.qualityGrade === 'A' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' :
                    item.qualityGrade === 'B' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                    }`}>
                    Grade {item.qualityGrade}
                  </span>
                </div>

                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <MapPin className="h-4 w-4 mr-1 text-red-400" />
                  {item.location_city || item.location?.city}, {item.location_state || item.location?.state}
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Price</span>
                    <div className="flex items-baseline">
                      <span className="text-xl font-bold text-gray-900 dark:text-white">
                        {formatCurrency(item.price)}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">/{item.unit}</span>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Seller</span>
                    <div className="flex items-center mt-1">
                      {item.seller && (
                        <>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 mr-2">{item.seller.name}</span>
                          <div className="flex items-center bg-yellow-50 dark:bg-yellow-900/20 px-1.5 py-0.5 rounded-md border border-yellow-100 dark:border-yellow-900/30">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs font-bold text-yellow-700 dark:text-yellow-400 ml-1">
                              {item.seller.rating || 4.5}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <Search className="h-12 w-12 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No items found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your search or filters to find what you're looking for.
          </p>
        </div>
      )}
    </div>
  )
}

export default MarketList