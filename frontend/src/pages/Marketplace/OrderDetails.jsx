import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { 
  fetchFarmerOrder, 
  updateOrderStatus 
} from '../../store/slices/farmerOrderSlice'
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Mail, 
  Truck, 
  CheckCircle, 
  XCircle, 
  Clock,
  Check
} from 'lucide-react'

const OrderDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { currentOrder: order, loading, error } = useSelector(state => state.farmerOrders)
  
  useEffect(() => {
    if (id) {
      dispatch(fetchFarmerOrder(id))
    }
  }, [dispatch, id])

  const handleStatusUpdate = (status) => {
    dispatch(updateOrderStatus({ orderId: id, status }))
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-blue-500" />
      case 'shipped':
        return <Truck className="h-5 w-5 text-indigo-500" />
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Clock className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending Confirmation'
      case 'confirmed':
        return 'Confirmed'
      case 'shipped':
        return 'Shipped'
      case 'delivered':
        return 'Delivered'
      case 'cancelled':
        return 'Cancelled'
      default:
        return 'Unknown'
    }
  }

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800'
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
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

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading order details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-red-600 text-4xl">!</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Order not found</h3>
            <p className="text-gray-600 mb-4">
              {error || 'The order you are looking for does not exist or has been removed.'}
            </p>
            <Button variant="primary" onClick={() => navigate('/marketplace/orders')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Orders
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
          onClick={() => navigate('/marketplace/orders')}
          className="flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Orders
        </Button>
      </div>

      {/* Order Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order #{order._id.substring(0, 8)}</h1>
              <div className="flex items-center mt-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(order.status)}`}>
                  {getStatusIcon(order.status)}
                  <span className="ml-2">{getStatusText(order.status)}</span>
                </span>
              </div>
              <p className="text-gray-600 mt-2">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
            
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">
                {formatCurrency(order.totalAmount)}
              </div>
              <div className="text-gray-600">
                Total Amount
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Order Items</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items?.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">{item.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {item.quantity} {item.unit} × {formatCurrency(item.price)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    {formatCurrency(item.quantity * item.price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="border-t border-gray-200 mt-4 pt-4">
            <div className="flex justify-between">
              <span className="font-medium text-gray-900">Total</span>
              <span className="font-bold text-gray-900">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Information */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold text-gray-900">Customer Information</h2>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-800 font-bold text-xl">
                  {order.buyerId?.name?.charAt(0) || 'C'}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">{order.buyerId?.name || 'Unknown Customer'}</h3>
                <p className="text-gray-600 text-sm mt-1">
                  Customer since {new Date().getFullYear()}
                </p>
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
          
          {order.shippingAddress && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="font-medium text-gray-900 mb-3">Delivery Address</h3>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5 mr-2" />
                <div className="text-gray-600">
                  <p>{order.shippingAddress.street}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.pincode}</p>
                  <p className="mt-1">Phone: {order.shippingAddress.contactNumber || 'Not provided'}</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        {order.status === 'pending' && (
          <Button 
            variant="primary" 
            onClick={() => handleStatusUpdate('confirmed')}
          >
            Confirm Order
          </Button>
        )}
        
        {order.status === 'confirmed' && (
          <Button 
            variant="primary" 
            onClick={() => handleStatusUpdate('shipped')}
          >
            Mark as Shipped
          </Button>
        )}
        
        {order.status === 'shipped' && (
          <Button 
            variant="primary" 
            onClick={() => handleStatusUpdate('delivered')}
            className="flex items-center"
          >
            <Check className="h-4 w-4 mr-2" />
            Mark as Delivered
          </Button>
        )}
        
        {(order.status === 'pending' || order.status === 'confirmed') && (
          <Button 
            variant="outline" 
            onClick={() => handleStatusUpdate('cancelled')}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            Cancel Order
          </Button>
        )}
      </div>
    </div>
  )
}

export default OrderDetails