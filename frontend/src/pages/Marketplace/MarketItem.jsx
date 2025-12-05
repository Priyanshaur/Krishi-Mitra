import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { MapPin, Star, Leaf, Calendar, Phone, Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { fetchMarketItem } from '../../store/slices/marketSlice'
import { orderAPI } from '../../services/api' 

const MarketItem = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { user } = useSelector(state => state.auth)
  const { currentItem: item, loading, error } = useSelector(state => state.market)
  const [orderStatus, setOrderStatus] = useState('idle')

  useEffect(() => {
    if (id) dispatch(fetchMarketItem(id))
  }, [dispatch, id])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount || 0)
  }

  const handlePlaceOrder = async () => {
    if (!user) {
      alert("Please login to place an order")
      navigate('/login')
      return
    }
    if (confirm(`Confirm order for ${item.title}?`)) {
      setOrderStatus('processing')
      try {
        await orderAPI.createOrder({
          sellerId: item.sellerId,
          totalAmount: item.price,
          items: [{ marketItemId: item.id, quantity: 1, price: item.price }],
          status: 'pending'
        })
        setOrderStatus('success')
        setTimeout(() => navigate('/dashboard/buyer'), 2000)
      } catch (err) {
        console.error("Order failed", err)
        setOrderStatus('error')
        alert("Failed to place order.")
      }
    }
  }

  // ✅ FIX: Real communication handlers
  const handleCall = () => {
    if (item?.seller?.phone) window.open(`tel:${item.seller.phone}`, '_self');
    else alert("Phone number not available");
  }

  const handleMessage = () => {
    if (item?.seller?.email) window.open(`mailto:${item.seller.email}?subject=Inquiry about ${item.title}`, '_self');
    else alert("Email not available. Please try calling.");
  }

  if (loading || !item) return <div className="p-10 text-center">Loading...</div>

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button variant="outline" onClick={() => navigate('/marketplace')}>
        <ArrowLeft className="h-4 w-4 mr-2" /> Back
      </Button>

      <Card>
        <CardContent className="p-0">
          <div className="relative h-96">
            <img 
              src={item.images?.[0]?.url || '/images/placeholder.jpg'} 
              className="w-full h-full object-cover rounded-t-lg"
              alt={item.title}
            />
            {item.organic && (
              <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm flex items-center">
                <Leaf className="h-4 w-4 mr-1" /> Organic
              </div>
            )}
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
              <div>
                <h1 className="text-2xl font-bold">{item.title}</h1>
                <div className="flex items-center text-gray-600 mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  {item.location_city}, {item.location_state}
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold">{formatCurrency(item.price)}</div>
                <div className="text-sm text-gray-500">per {item.unit}</div>
              </div>
            </div>

            {/* Seller Info */}
            <div className="mt-8 border-t pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-xl">
                    {item.seller?.name?.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium">{item.seller?.name}</div>
                    <div className="flex items-center text-sm text-yellow-600">
                      <Star className="h-3 w-3 fill-current mr-1" />
                      {item.seller?.rating || 4.5} Rating
                    </div>
                  </div>
                </div>
                <div className="flex space-x-3">
                  <Button variant="outline" onClick={handleCall}>
                    <Phone className="h-4 w-4 mr-2" /> Call
                  </Button>
                  <Button variant="outline" onClick={handleMessage}>
                    <Mail className="h-4 w-4 mr-2" /> Message
                  </Button>
                </div>
              </div>
            </div>

            <div className="mt-6">
              {orderStatus === 'success' ? (
                <Button className="w-full bg-green-600 text-white">
                  <CheckCircle className="h-5 w-5 mr-2" /> Order Placed!
                </Button>
              ) : (
                <Button variant="primary" className="w-full" onClick={handlePlaceOrder} disabled={orderStatus === 'processing'}>
                  {orderStatus === 'processing' ? 'Processing...' : 'Place Order Now'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default MarketItem