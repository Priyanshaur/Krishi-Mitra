import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { MapPin, Star, Leaf, Calendar, Phone, Mail, ArrowLeft, Heart, ShoppingBag, Minus, Plus } from 'lucide-react'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { fetchMarketItem } from '../../store/slices/marketSlice'
import { buyerOrdersAPI } from '../../services/api'
import toast from 'react-hot-toast'

const MarketItem = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { currentItem: item, loading, error } = useSelector(state => state.market)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [ordering, setOrdering] = useState(false)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (id) {
      dispatch(fetchMarketItem(id))
      // Check wishlist status
      const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
      setIsWishlisted(wishlist.includes(id))
    }
  }, [dispatch, id])

  const handleAddToWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]')
    let newWishlist

    if (isWishlisted) {
      newWishlist = wishlist.filter(itemId => itemId !== id)
      toast.success('Removed from wishlist')
    } else {
      newWishlist = [...wishlist, id]
      toast.success('Added to wishlist')
    }

    localStorage.setItem('wishlist', JSON.stringify(newWishlist))
    setIsWishlisted(!isWishlisted)
  }

  const handleQuantityChange = (type) => {
    if (type === 'increase') {
      if (quantity < item.quantity) {
        setQuantity(prev => prev + 1)
      } else {
        toast.error(`Only ${item.quantity} ${item.unit} available`)
      }
    } else {
      if (quantity > 1) {
        setQuantity(prev => prev - 1)
      }
    }
  }

  const handlePlaceOrder = async () => {
    if (!user) {
      toast.error('Please login to place an order')
      navigate('/login')
      return
    }

    if (user.role === 'farmer' && user.id === item.sellerId) {
      toast.error('You cannot buy your own item')
      return
    }

    if (window.confirm(`Confirm order for ${quantity} ${item.unit} of ${item.title} at ${formatCurrency(item.price * quantity)}?`)) {
      try {
        setOrdering(true)
        const orderData = {
          items: [{
            marketItemId: item.id,
            quantity: quantity,
            price: item.price,
            title: item.title,
            unit: item.unit
          }],
          totalAmount: item.price * quantity,
          sellerId: item.sellerId,
          shippingAddress: user.address || {
            street: '123 Main St',
            city: 'Mumbai',
            state: 'Maharashtra',
            pincode: '400001',
            country: 'India'
          }
        }

        await buyerOrdersAPI.createOrder(orderData)
        toast.success('Order placed successfully!')
        navigate('/orders') // Navigate to buyer orders page
      } catch (error) {
        console.error('Order placement error:', error)
        toast.error(error.response?.data?.message || 'Failed to place order')
      } finally {
        setOrdering(false)
      }
    }
  }

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
            <p className="text-gray-600 dark:text-gray-400">Loading item details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !item) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
              <span className="text-red-600 dark:text-red-400 text-4xl">!</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Item not found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {error || 'The item you are looking for does not exist or has been removed.'}
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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Button */}
      <div>
        <Button
          variant="outline"
          onClick={() => navigate('/marketplace')}
          className="flex items-center dark:text-white dark:border-gray-600"
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
              <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 rounded-t-lg flex items-center justify-center">
                <span className="text-gray-500 dark:text-gray-400">No image available</span>
              </div>
            )}

            {item.organic && (
              <div className="absolute top-6 left-6 bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center shadow-lg">
                <Leaf className="h-4 w-4 mr-1" />
                Organic
              </div>
            )}

            <div className="absolute top-6 right-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm shadow-lg">
              {item.status === 'active' ? (
                <span className="text-green-600 dark:text-green-400 font-medium">Available</span>
              ) : (
                <span className="text-yellow-600 dark:text-yellow-400 font-medium">Sold Out</span>
              )}
            </div>
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{item.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-red-500" />
                    {item.location_city}, {item.location_state}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    Added on {formatDate(item.createdAt)}
                  </div>
                  <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs px-2 py-1 rounded-full">
                    {item.qualityGrade}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900 dark:text-white">
                  {formatCurrency(item.price)}
                </div>
                <div className="text-gray-600 dark:text-gray-400">
                  per {item.unit} • {item.quantity} {item.unit} available
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mt-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Description</h2>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                {item.description || 'No description provided for this item.'}
              </p>
            </div>

            {/* Quantity Selector */}
            {item.status === 'active' && (
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Select Quantity</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
                    <button
                      onClick={() => handleQuantityChange('decrease')}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-l-lg transition-colors"
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                    </button>
                    <span className="w-12 text-center font-medium text-gray-900 dark:text-white">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange('increase')}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-r-lg transition-colors"
                      disabled={quantity >= item.quantity}
                    >
                      <Plus className="h-4 w-4 text-gray-600 dark:text-gray-300" />
                    </button>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Total: <span className="font-bold text-gray-900 dark:text-white">{formatCurrency(item.price * quantity)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Additional Details */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Product Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                    <span className="text-gray-600 dark:text-gray-400">Category</span>
                    <span className="font-medium capitalize text-gray-900 dark:text-white">{item.category}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                    <span className="text-gray-600 dark:text-gray-400">Quality Grade</span>
                    <span className="font-medium capitalize text-gray-900 dark:text-white">{item.qualityGrade}</span>
                  </div>
                  {item.harvestDate && (
                    <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                      <span className="text-gray-600 dark:text-gray-400">Harvest Date</span>
                      <span className="font-medium text-gray-900 dark:text-white">{formatDate(item.harvestDate)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-b border-gray-100 dark:border-gray-700 pb-2">
                    <span className="text-gray-600 dark:text-gray-400">Organic</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {item.organic ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {item.tags && item.tags.length > 0 ? (
                    item.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500 dark:text-gray-400 text-sm">No tags available</span>
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
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Seller Information</h2>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                <span className="text-green-800 dark:text-green-300 font-bold text-xl">
                  {item.seller?.name?.charAt(0) || 'S'}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{item.seller?.name || 'Unknown Seller'}</h3>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                  <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                  <span>{item.seller?.rating || 4.5} Rating</span>
                </div>
                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  {item.location_city}, {item.location_state}
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button variant="outline" className="flex items-center dark:text-white dark:border-gray-600">
                <Phone className="h-4 w-4 mr-2" />
                Call
              </Button>
              <Button variant="outline" className="flex items-center dark:text-white dark:border-gray-600">
                <Mail className="h-4 w-4 mr-2" />
                Message
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 sticky bottom-4 z-10">
        <Button
          variant="primary"
          className="flex-1 shadow-xl text-lg py-4"
          onClick={handlePlaceOrder}
          disabled={ordering || item.status !== 'active'}
        >
          {ordering ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
          ) : (
            <ShoppingBag className="h-5 w-5 mr-2" />
          )}
          {item.status === 'active' ? `Place Order (${formatCurrency(item.price * quantity)})` : 'Sold Out'}
        </Button>
        <Button
          variant="secondary"
          className={`flex-1 shadow-xl text-lg py-4 ${isWishlisted ? 'bg-pink-50 text-pink-600 border-pink-200 dark:bg-pink-900/20 dark:text-pink-300 dark:border-pink-900/50' : ''}`}
          onClick={handleAddToWishlist}
        >
          <Heart className={`h-5 w-5 mr-2 ${isWishlisted ? 'fill-current' : ''}`} />
          {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
        </Button>
      </div>
    </div>
  )
}

export default MarketItem