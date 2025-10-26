import React, { useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { MapPin, Star, Leaf, Calendar, Phone, Mail, ArrowLeft } from 'lucide-react'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { fetchMarketItem } from '../../store/slices/marketSlice'

const MarketItem = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { currentItem: item, loading, error } = useSelector(state => state.market)

  useEffect(() => {
    console.log('MarketItem component mounted with ID:', id)
    if (id) {
      console.log('Dispatching fetchMarketItem with ID:', id)
      dispatch(fetchMarketItem(id))
    } else {
      console.log('No ID provided')
    }
  }, [dispatch, id])

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading item details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !item) {
    console.log('Error or no item found:', { error, item, id })
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-red-600 text-4xl">!</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Item not found</h3>
            <p className="text-gray-600 mb-4">
              {error || 'The item you are looking for does not exist or has been removed.'}
            </p>
            <p className="text-gray-500 text-sm mb-4">
              Requested ID: {id}
            </p>
            <Button variant="primary" onClick={() => navigate('/marketplace')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Marketplace
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  console.log('Rendering item:', item)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <div>
        <Button 
          variant="outline" 
          onClick={() => navigate('/marketplace')}
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Marketplace
        </Button>
      </div>

      {/* Item Details */}
      <Card>
        <CardContent className="p-0">
          {/* Image Gallery */}
          <div className="relative">
            {item.images && item.images.length > 0 ? (
              <img
                src={item.images[0].url}
                alt={item.title}
                className="w-full h-96 object-cover rounded-t-lg"
              />
            ) : (
              <div className="w-full h-96 bg-gray-200 rounded-t-lg flex items-center justify-center">
                <span className="text-gray-500">No image available</span>
              </div>
            )}
            
            {item.organic && (
              <div className="absolute top-6 left-6 bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center">
                <Leaf className="h-4 w-4 mr-1" />
                Organic
              </div>
            )}
            
            <div className="absolute top-6 right-6 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
              {item.status === 'active' ? (
                <span className="text-green-600 font-medium">Available</span>
              ) : (
                <span className="text-yellow-600 font-medium">Sold Out</span>
              )}
            </div>
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{item.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {item.location?.city}, {item.location?.state}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Added on {formatDate(item.createdAt)}
                  </div>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                    {item.qualityGrade}
                  </span>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">
                  {formatCurrency(item.price)}
                </div>
                <div className="text-gray-600">
                  per {item.unit} • {item.quantity} {item.unit} available
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Description</h2>
              <p className="text-gray-700">
                {item.description || 'No description provided for this item.'}
              </p>
            </div>

            {/* Additional Details */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Product Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category</span>
                    <span className="font-medium capitalize">{item.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Quality Grade</span>
                    <span className="font-medium capitalize">{item.qualityGrade}</span>
                  </div>
                  {item.harvestDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Harvest Date</span>
                      <span className="font-medium">{formatDate(item.harvestDate)}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Organic</span>
                    <span className="font-medium">
                      {item.organic ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {item.tags && item.tags.length > 0 ? (
                    item.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 text-sm">No tags available</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Seller Information */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Seller Information</h2>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-800 font-bold text-xl">
                  {item.seller?.name?.charAt(0) || 'S'}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{item.seller?.name || 'Unknown Seller'}</h3>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                  <span>{item.seller?.rating || 4.5} Rating</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  {item.location?.city}, {item.location?.state}
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button variant="outline" className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                Call
              </Button>
              <Button variant="outline" className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                Message
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="primary" className="flex-1">
          Place Order
        </Button>
        <Button variant="secondary" className="flex-1">
          Add to Wishlist
        </Button>
      </div>
    </div>
  )
}

export default MarketItem