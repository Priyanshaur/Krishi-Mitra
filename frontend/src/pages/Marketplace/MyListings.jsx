import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Search, Filter, MapPin, Star, Leaf, Plus, Edit, Trash2 } from 'lucide-react'
import { Card, CardContent } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { fetchUserMarketItems, deleteMarketItem } from '../../store/slices/marketSlice'
import toast from 'react-hot-toast'

const MyListings = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user } = useSelector(state => state.auth)
  const { userItems: items, loading } = useSelector(state => state.market)

  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    dispatch(fetchUserMarketItems())
  }, [dispatch])

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  const handleEdit = (itemId) => {
    // Navigate to edit page (assuming it exists or will be created)
    navigate(`/marketplace/edit/${itemId}`)
  }

  const handleDelete = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        await dispatch(deleteMarketItem(itemId)).unwrap()
        toast.success('Listing deleted successfully')
        // Refresh list
        dispatch(fetchUserMarketItems())
      } catch (error) {
        toast.error('Failed to delete listing')
        console.error(error)
      }
    }
  }

  // Filter items based on search term
  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading your listings...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Listings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage your crop listings in the marketplace
          </p>
        </div>
        <Link to="/marketplace/create">
          <Button variant="primary">
            <Plus className="h-4 w-4 mr-2" />
            Add New Listing
          </Button>
        </Link>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative z-0"> {/* Added z-0 to ensure it doesn't overlap weirdly but stays visible */}
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search your listings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white dark:placeholder-gray-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* No listings message */}
      {filteredItems.length === 0 && !loading && (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
              <Leaf className="h-12 w-12 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No listings yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Get started by creating your first crop listing
            </p>
            <Link to="/marketplace/create">
              <Button variant="primary">
                <Plus className="h-4 w-4 mr-2" />
                Create Listing
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Products Grid */}
      {filteredItems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <Card key={item.id} className="hover:shadow-lg transition-all duration-300">
              <div className="relative">
                {item.images && item.images.length > 0 ? (
                  <img
                    src={item.images[0].url}
                    alt={item.title}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-t-lg flex items-center justify-center">
                    <span className="text-gray-500 dark:text-gray-400">No image</span>
                  </div>
                )}
                {item.organic && (
                  <div className="absolute top-3 left-3 bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center shadow-sm">
                    <Leaf className="h-3 w-3 mr-1" />
                    Organic
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-2 py-1 rounded-full text-xs shadow-sm">
                  {item.status === 'active' ? (
                    <span className="text-green-600 dark:text-green-400 font-medium">Active</span>
                  ) : (
                    <span className="text-yellow-600 dark:text-yellow-400 font-medium">Inactive</span>
                  )}
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2 flex-1">{item.title}</h3>
                  <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs px-2 py-1 rounded-full ml-2 whitespace-nowrap">
                    {item.qualityGrade}
                  </span>
                </div>

                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                  <MapPin className="h-4 w-4 mr-1 text-red-500" />
                  {/* Handle location object correctly */}
                  {item.location_city || item.location?.city}, {item.location_state || item.location?.state}
                </div>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                      {item.seller?.rating || 4.5}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Qty: {item.quantity} {item.unit}
                  </span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {formatCurrency(item.price)}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">/{item.unit}</span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-500">
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => handleEdit(item.id)}
                    className="flex-1 dark:text-white dark:border-gray-600"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="small"
                    onClick={() => handleDelete(item.id)}
                    className="flex-1 text-red-600 border-red-200 hover:bg-red-50 dark:hover:bg-red-900/20 dark:border-red-900/50"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyListings