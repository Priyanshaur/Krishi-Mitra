import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardContent, CardHeader } from '../../components/ui/Card'
import Button from '../../components/ui/Button'
import { fetchBuyerOrders } from '../../store/slices/buyerOrderSlice'
import {
    ShoppingCart,
    Package,
    Truck,
    CheckCircle,
    XCircle,
    Clock,
    MapPin
} from 'lucide-react'

const BuyerOrders = () => {
    const dispatch = useDispatch()
    const { orders, loading, error } = useSelector(state => state.buyerOrders)

    useEffect(() => {
        dispatch(fetchBuyerOrders())
    }, [dispatch])

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
            <div className="max-w-7xl mx-auto space-y-6">
                <div className="flex items-center justify-center h-64">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                        <p className="text-gray-600 dark:text-gray-400">Loading your orders...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto space-y-6">
                <Card>
                    <CardContent className="p-12 text-center">
                        <div className="mx-auto w-24 h-24 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                            <span className="text-red-600 dark:text-red-400 text-4xl">!</span>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Error loading orders</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            {error}
                        </p>
                        <Button variant="primary" onClick={() => dispatch(fetchBuyerOrders())}>
                            Try Again
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="max-w-7xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Orders</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Track and manage your purchases
                </p>
            </div>

            {/* Orders List */}
            {orders.length > 0 ? (
                <div className="space-y-6">
                    {orders.map((order) => (
                        <Card key={order.id} className="overflow-hidden">
                            <div className="p-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-sm text-gray-500">Order #{order.id.substring(0, 8)}</span>
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(order.status)}`}>
                                                {getStatusIcon(order.status)}
                                                <span className="ml-1">{getStatusText(order.status)}</span>
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            Placed on {new Date(order.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="mt-4 md:mt-0">
                                        <Link to={`/orders/${order.id}`}>
                                            <Button variant="outline" size="small">
                                                View Details
                                            </Button>
                                        </Link>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                    <div className="flow-root">
                                        <ul className="-my-6 divide-y divide-gray-200 dark:divide-gray-700">
                                            {order.items?.map((item, index) => {
                                                // Get image from nested MarketItem or use placeholder
                                                const imageUrl = item.MarketItem?.images?.[0]?.url
                                                    || (item.MarketItem?.images?.[0] && typeof item.MarketItem.images[0] === 'string' ? item.MarketItem.images[0] : null)
                                                    || 'https://via.placeholder.com/150';

                                                return (
                                                    <li key={index} className="py-6 flex">
                                                        <div className="flex-shrink-0 w-24 h-24 border border-gray-200 dark:border-gray-700 rounded-md overflow-hidden">
                                                            <img
                                                                src={imageUrl}
                                                                alt={item.title}
                                                                className="w-full h-full object-center object-cover"
                                                            />
                                                        </div>

                                                        <div className="ml-4 flex-1 flex flex-col">
                                                            <div>
                                                                <div className="flex justify-between text-base font-medium text-gray-900 dark:text-white">
                                                                    <h3>{item.title}</h3>
                                                                    <p className="ml-4">{formatCurrency(item.price * item.quantity)}</p>
                                                                </div>
                                                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                                    Quantity: {item.quantity} {item.unit}
                                                                </p>
                                                            </div>
                                                            <div className="flex-1 flex items-end justify-between text-sm">
                                                                <div className="flex items-center text-gray-500 dark:text-gray-400">
                                                                    <MapPin className="h-4 w-4 mr-1" />
                                                                    {order.seller?.location || 'Seller Location'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 dark:bg-gray-800 px-6 py-4 flex items-center justify-between">
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    Sold by <span className="font-medium text-gray-900 dark:text-white">{order.seller?.name || 'Unknown Seller'}</span>
                                </div>
                                <div className="text-base font-medium text-gray-900 dark:text-white">
                                    Total: {formatCurrency(order.totalAmount || order.items?.reduce((acc, item) => acc + (item.price * item.quantity), 0))}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card>
                    <CardContent className="p-12 text-center">
                        <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
                            <ShoppingCart className="h-12 w-12 text-gray-400 dark:text-gray-500" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No orders yet</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            You haven't placed any orders yet. Start shopping!
                        </p>
                        <Link to="/marketplace">
                            <Button variant="primary">
                                Browse Marketplace
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

export default BuyerOrders
