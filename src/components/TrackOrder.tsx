import React, { useState } from 'react';
import { Search, Package, Truck, CheckCircle, Clock, MapPin, ExternalLink, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';

interface OrderItem {
    product_name: string;
    variation_name?: string;
    quantity: number;
    price: number;
    total: number;
}

interface OrderDetails {
    id: string;
    order_status: string;
    payment_status: string;
    tracking_number: string | null;
    shipping_note: string | null;
    total_price: number;
    shipping_fee: number;
    order_items: OrderItem[];
    created_at: string;
}

const TrackOrder: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [order, setOrder] = useState<OrderDetails | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsLoading(true);
        setError(null);
        setOrder(null);
        setHasSearched(true);

        try {
            // Try using the get_order_details function
            const { data, error: rpcError } = await supabase.rpc('get_order_details', {
                order_id_input: searchQuery.trim()
            });

            if (rpcError) {
                // Fallback to direct query if RPC fails
                const { data: directData, error: directError } = await supabase
                    .from('orders')
                    .select('id, order_status, payment_status, tracking_number, shipping_note, total_price, shipping_fee, order_items, created_at')
                    .or(`id.ilike.${searchQuery.trim()}%,order_number.ilike.%${searchQuery.trim()}%`)
                    .limit(1)
                    .single();

                if (directError || !directData) {
                    setError('Order not found. Please check your order number and try again.');
                    return;
                }
                setOrder(directData as OrderDetails);
            } else if (data && data.length > 0) {
                setOrder(data[0] as OrderDetails);
            } else {
                setError('Order not found. Please check your order number and try again.');
            }
        } catch (err) {
            console.error('Error fetching order:', err);
            setError('An error occurred while searching. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'new': return 'bg-blue-100 text-blue-700';
            case 'processing': return 'bg-yellow-100 text-yellow-700';
            case 'shipped': return 'bg-purple-100 text-purple-700';
            case 'delivered': return 'bg-green-100 text-green-700';
            case 'cancelled': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'paid': return 'bg-green-100 text-green-700';
            case 'pending': return 'bg-yellow-100 text-yellow-700';
            case 'failed': return 'bg-red-100 text-red-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusStep = (status: string) => {
        switch (status.toLowerCase()) {
            case 'new': return 0;
            case 'processing': return 1;
            case 'shipped': return 2;
            case 'delivered': return 3;
            default: return 0;
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-PH', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const statusSteps = [
        { label: 'Order Placed', icon: Package },
        { label: 'Processing', icon: Clock },
        { label: 'Shipped', icon: Truck },
        { label: 'Delivered', icon: CheckCircle }
    ];

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-theme-accent to-theme-secondary text-white py-16 px-4 mb-12 relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="container mx-auto max-w-6xl relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <MapPin className="w-16 h-16 mx-auto mb-4 opacity-90" />
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Track Your Order</h1>
                        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto">
                            Enter your order number to check the current status of your shipment.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-3xl">
                {/* Search Form */}
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleSearch}
                    className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8"
                >
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Order Number
                    </label>
                    <div className="flex gap-3">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="Enter your order number (e.g., TPL#001)"
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-theme-accent focus:border-transparent outline-none transition-all"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading || !searchQuery.trim()}
                            className="bg-theme-accent text-white px-6 py-3 rounded-lg font-medium hover:bg-theme-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Search className="w-4 h-4" />
                                    Track
                                </>
                            )}
                        </button>
                    </div>
                </motion.form>

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 border border-red-100 rounded-xl p-6 mb-8 flex items-start gap-3"
                    >
                        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <div>
                            <p className="text-red-700 font-medium">{error}</p>
                            <p className="text-red-600 text-sm mt-1">
                                Make sure to enter the exact order number as shown in your confirmation message.
                            </p>
                        </div>
                    </motion.div>
                )}

                {/* Order Details */}
                {order && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Status Timeline */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="font-bold text-gray-900 text-lg mb-6">Order Status</h2>

                            <div className="flex justify-between items-center mb-8 relative">
                                {/* Progress Line */}
                                <div className="absolute left-0 right-0 top-5 h-1 bg-gray-200 -z-10"></div>
                                <div
                                    className="absolute left-0 top-5 h-1 bg-theme-accent transition-all -z-10"
                                    style={{ width: `${(getStatusStep(order.order_status) / 3) * 100}%` }}
                                ></div>

                                {statusSteps.map((step, idx) => {
                                    const isCompleted = idx <= getStatusStep(order.order_status);
                                    const isCurrent = idx === getStatusStep(order.order_status);
                                    return (
                                        <div key={idx} className="flex flex-col items-center">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isCompleted ? 'bg-theme-accent text-white' : 'bg-gray-200 text-gray-500'
                                                } ${isCurrent ? 'ring-4 ring-theme-accent/30' : ''}`}>
                                                <step.icon className="w-5 h-5" />
                                            </div>
                                            <span className={`text-xs mt-2 font-medium ${isCompleted ? 'text-theme-accent' : 'text-gray-500'}`}>
                                                {step.label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.order_status)}`}>
                                    Order: {order.order_status.charAt(0).toUpperCase() + order.order_status.slice(1)}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentStatusColor(order.payment_status)}`}>
                                    Payment: {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                                </span>
                            </div>
                        </div>

                        {/* Tracking Number */}
                        {order.tracking_number && (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                <h2 className="font-bold text-gray-900 text-lg mb-4">Tracking Information</h2>
                                <div className="flex items-center gap-3 mb-4">
                                    <Truck className="w-5 h-5 text-theme-accent" />
                                    <span className="font-mono text-lg">{order.tracking_number}</span>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    <a
                                        href={`https://www.jtexpress.ph/index/query/gzquery.html?waybillNo=${order.tracking_number}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        Track on J&T Express
                                    </a>
                                    <a
                                        href={`https://www.lbcexpress.com/track/?tracking_no=${order.tracking_number}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                        Track on LBC
                                    </a>
                                </div>
                            </div>
                        )}

                        {/* Shipping Note */}
                        {order.shipping_note && (
                            <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 flex items-start gap-3">
                                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                <p className="text-yellow-800 text-sm">{order.shipping_note}</p>
                            </div>
                        )}

                        {/* Order Items */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h2 className="font-bold text-gray-900 text-lg mb-4">Order Details</h2>
                            <p className="text-sm text-gray-500 mb-4">Ordered on {formatDate(order.created_at)}</p>

                            <div className="divide-y divide-gray-100">
                                {order.order_items.map((item, idx) => (
                                    <div key={idx} className="py-3 flex justify-between items-start">
                                        <div>
                                            <p className="font-medium text-gray-900">{item.product_name}</p>
                                            {item.variation_name && (
                                                <p className="text-sm text-theme-accent">{item.variation_name}</p>
                                            )}
                                            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="font-semibold text-gray-900">
                                            ₱{item.total.toLocaleString('en-PH', { minimumFractionDigits: 0 })}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-200 mt-4 pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">₱{(order.total_price - order.shipping_fee).toLocaleString('en-PH', { minimumFractionDigits: 0 })}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-medium">
                                        {order.shipping_fee > 0
                                            ? `₱${order.shipping_fee.toLocaleString('en-PH', { minimumFractionDigits: 0 })}`
                                            : 'To be discussed'
                                        }
                                    </span>
                                </div>
                                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-100">
                                    <span>Total</span>
                                    <span className="text-theme-accent">₱{order.total_price.toLocaleString('en-PH', { minimumFractionDigits: 0 })}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* No Results State */}
                {hasSearched && !order && !error && !isLoading && (
                    <div className="text-center py-12">
                        <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">Enter your order number above to track your order.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrackOrder;
