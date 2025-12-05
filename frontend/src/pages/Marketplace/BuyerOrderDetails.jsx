import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { fetchBuyerOrders } from '../../store/slices/buyerOrderSlice'
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

const BuyerOrderDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { orders, loading, error } = useSelector(state => state.buyerOrders)

    // Find the order from the list (since we don't have a fetchSingleOrder for buyers yet)
    // Ideally we should add fetchOrder to buyerOrderSlice, but finding from list works if list is loaded
    const order = orders.find(o => o.id === id)

    useEffect(() => {
        if (!order && !loading) {
            dispatch(fetchBuyerOrders())
        }
    }, [dispatch, order, loading])

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
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
            case 'confirmed':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
            case 'shipped':
                return 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300'
            case 'delivered':
                return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
            case 'cancelled':
                return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
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
                        <p className="text-gray-600 dark:text-gray-400">Loading order details...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (!order) {
        return (
            <div className="max-w-4xl mx-auto">
                <Card>
                    <CardContent className="p-12 text-center">
                        <div className="mx-auto w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                            <span className="text-red-600 dark:text-red-400 text-4xl">!</span>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Order not found</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            The order you are looking for does not exist or has been removed.
                        </p>
                        <Button variant="primary" onClick={() => navigate('/orders')}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to My Orders
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    // Construct shipping address from flattened fields if necessary
    const shippingAddress = order.shippingAddress || {
        street: order.shipping_street,
        city: order.shipping_city,
        state: order.shipping_state,
        pincode: order.shipping_pincode,
        contactNumber: order.shipping_contactNumber
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* Back Button */}
            <div>
                <Button
                    variant="outline"
                    onClick={() => navigate('/orders')}
                    className="flex items-center dark:text-white dark:border-gray-600"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to My Orders
                </Button>
            </div>

            {/* Order Header */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Order #{order.id?.substring(0, 8)}</h1>
                            <div className="flex items-center mt-2">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusClass(order.status)}`}>
                                    {getStatusIcon(order.status)}
                                    <span className="ml-2">{getStatusText(order.status)}</span>
                                </span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 mt-2">
                                Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                })}
                            </p>
                        </div>

                        <div className="text-right">
                            <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                {formatCurrency(order.totalAmount)}
                            </div>
                            <div className="text-gray-600 dark:text-gray-400">
                                Total Amount
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Order Items */}
            <Card>
                <CardHeader>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Order Items</h2>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {order.items?.map((item, index) => {
                            const imageUrl = item.MarketItem?.images?.[0]?.url
                                || (item.MarketItem?.images?.[0] && typeof item.MarketItem.images[0] === 'string' ? item.MarketItem.images[0] : null)
                                || 'https://via.placeholder.com/150';

                            return (
                                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 w-16 h-16 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden mr-4">
                                            <img
                                                src={imageUrl}
                                                alt={item.title}
                                                className="w-full h-full object-center object-cover"
                                            />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-gray-900 dark:text-white">{item.title}</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                {item.quantity} {item.unit} × {formatCurrency(item.price)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-medium text-gray-900 dark:text-white">
                                            {formatCurrency(item.quantity * item.price)}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
                        <div className="flex justify-between">
                            <span className="font-medium text-gray-900 dark:text-white">Total</span>
                            <span className="font-bold text-gray-900 dark:text-white">
                                {formatCurrency(order.totalAmount)}
                            </span>
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
                                    {order.seller?.name?.charAt(0) || 'S'}
                                </span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 dark:text-white">{order.seller?.name || 'Unknown Seller'}</h3>
                                <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm mt-1">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    {order.seller?.location || 'Location not available'}
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

            {/* Delivery Address */}
            <Card>
                <CardHeader>
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Delivery Address</h2>
                </CardHeader>
                <CardContent>
                    {(shippingAddress.street || shippingAddress.city) ? (
                        <div className="flex items-start">
                            <MapPin className="h-5 w-5 text-gray-400 dark:text-gray-500 mt-0.5 mr-2" />
                            <div className="text-gray-600 dark:text-gray-400">
                                <p>{shippingAddress.street}</p>
                                <p>{shippingAddress.city}, {shippingAddress.state} {shippingAddress.pincode}</p>
                                <p className="mt-1">Phone: {shippingAddress.contactNumber || 'Not provided'}</p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-gray-500">No delivery address provided.</p>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

export default BuyerOrderDetails
