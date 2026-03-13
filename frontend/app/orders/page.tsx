'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Wrapper from '@/components/magicui/Wrapper';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import {
  Package,
  ShoppingBag,
  AlertCircle,
  CheckCircle,
  MapPin,
} from 'lucide-react';
import {
  getOrders,
  getSales,
  simulatePayment,
  setMeeting,
  verifyOtp,
  cancelOrder,
  type OrderResponse,
} from '@/lib/api/orders';
import { ApiError } from '@/lib/api/client';

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; border: string }
> = {
  PENDING_PAYMENT: {
    label: 'Awaiting Payment',
    color: 'text-amber-700',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
  },
  PAYMENT_COMPLETED: {
    label: 'Payment Confirmed',
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
  SELLER_NOTIFIED: {
    label: 'Seller Notified',
    color: 'text-blue-700',
    bg: 'bg-blue-50',
    border: 'border-blue-200',
  },
  MEETING_ARRANGED: {
    label: 'Meeting Scheduled',
    color: 'text-purple-700',
    bg: 'bg-purple-50',
    border: 'border-purple-200',
  },
  OTP_GENERATED: {
    label: 'OTP Verification',
    color: 'text-orange-700',
    bg: 'bg-orange-50',
    border: 'border-orange-200',
  },
  COMPLETED: {
    label: 'Completed',
    color: 'text-green-700',
    bg: 'bg-green-50',
    border: 'border-green-200',
  },
  CANCELLED: {
    label: 'Cancelled',
    color: 'text-red-700',
    bg: 'bg-red-50',
    border: 'border-red-200',
  },
  DISPUTED: {
    label: 'Disputed',
    color: 'text-red-700',
    bg: 'bg-red-50',
    border: 'border-red-200',
  },
};

const placeholderImage =
  'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop';

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] ?? {
    label: status,
    color: 'text-gray-700',
    bg: 'bg-gray-50',
    border: 'border-gray-200',
  };
  return (
    <span
      className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.color} ${cfg.bg} ${cfg.border}`}
    >
      {cfg.label}
    </span>
  );
}

interface OrderCardProps {
  order: OrderResponse;
  isSale: boolean;
  onRefresh: () => void;
}

function OrderCard({ order, isSale, onRefresh }: OrderCardProps) {
  const [isActing, setIsActing] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [meetingTime, setMeetingTime] = useState('');
  const [meetingLocation, setMeetingLocation] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [showMeetingForm, setShowMeetingForm] = useState(false);
  const [showOtpForm, setShowOtpForm] = useState(false);

  const act = async (fn: () => Promise<unknown>, successMsg: string) => {
    setIsActing(true);
    setActionError(null);
    setActionSuccess(null);
    try {
      await fn();
      setActionSuccess(successMsg);
      onRefresh();
    } catch (error) {
      if (error instanceof ApiError) {
        setActionError(error.message || 'Action failed. Please try again.');
      } else {
        setActionError('Unable to connect to the server.');
      }
    } finally {
      setIsActing(false);
    }
  };

  const firstItem = order.items?.[0];
  const img = placeholderImage;
  const itemCount = order.items?.length ?? 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:border-gray-300 transition-all duration-200 overflow-hidden">
      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 flex-shrink-0">
              <Image src={img} alt="Order item" fill sizes="56px" className="object-cover" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900 line-clamp-1">
                {firstItem?.productTitle ?? 'Order'}
                {itemCount > 1 && (
                  <span className="ml-1 text-gray-500 font-normal">+{itemCount - 1} more</span>
                )}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Order #{order.id} &middot;{' '}
                {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-lg font-bold text-gray-900">
              ₹{Number(order.totalPrice).toLocaleString()}
            </p>
            <StatusBadge status={order.orderStatus} />
          </div>
        </div>

        {/* Meeting info */}
        {order.meetingDate && (
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-3 mb-4 flex items-start gap-2">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs font-medium text-gray-700">
                {new Date(order.meetingDate).toLocaleString('en-IN', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </p>
              {order.meetingLocation && (
                <p className="text-xs text-gray-500 mt-0.5">{order.meetingLocation}</p>
              )}
            </div>
          </div>
        )}

        {/* Feedback */}
        {actionSuccess && (
          <div className="mb-3 bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
            <span className="text-xs text-green-800 font-medium">{actionSuccess}</span>
          </div>
        )}
        {actionError && (
          <div className="mb-3 bg-red-50 border border-red-200 rounded-xl p-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
            <span className="text-xs text-red-800 font-medium">{actionError}</span>
          </div>
        )}

        {/* Buyer actions */}
        {!isSale && (
          <>
            {order.orderStatus === 'PENDING_PAYMENT' && (
              <div className="flex gap-2">
                <button
                  onClick={() => act(() => simulatePayment(order.id), 'Payment confirmed!')}
                  disabled={isActing}
                  className="flex-1 py-2.5 px-4 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-xl transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {isActing ? 'Processing...' : 'Complete Payment'}
                </button>
                <button
                  onClick={() => act(() => cancelOrder(order.id), 'Order cancelled.')}
                  disabled={isActing}
                  className="py-2.5 px-4 border border-gray-200 hover:border-red-300 hover:text-red-600 text-gray-700 text-sm font-medium rounded-xl transition-all disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            )}

            {(order.orderStatus === 'MEETING_ARRANGED' || order.orderStatus === 'OTP_GENERATED') && (
              <>
                {!showOtpForm ? (
                  <button
                    onClick={() => setShowOtpForm(true)}
                    className="w-full py-2.5 px-4 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-xl transition-all"
                  >
                    Enter OTP to Complete
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                      className="flex-1 px-4 py-2.5 border border-gray-200 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent focus:bg-white"
                    />
                    <button
                      onClick={() =>
                        act(() => verifyOtp(order.id, otpInput), 'Order completed!')
                      }
                      disabled={isActing || otpInput.length < 4}
                      className="py-2.5 px-4 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-xl transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      Verify
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Seller actions */}
        {isSale && (
          <>
            {(order.orderStatus === 'PAYMENT_COMPLETED' || order.orderStatus === 'SELLER_NOTIFIED') && (
              <>
                {!showMeetingForm ? (
                  <button
                    onClick={() => setShowMeetingForm(true)}
                    className="w-full py-2.5 px-4 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-xl transition-all"
                  >
                    Set Meeting Details
                  </button>
                ) : (
                  <div className="space-y-3">
                    <input
                      type="datetime-local"
                      value={meetingTime}
                      onChange={(e) => setMeetingTime(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent focus:bg-white"
                    />
                    <input
                      type="text"
                      value={meetingLocation}
                      onChange={(e) => setMeetingLocation(e.target.value)}
                      placeholder="Meeting location (e.g. Main Gate, Canteen)"
                      className="w-full px-4 py-2.5 border border-gray-200 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent focus:bg-white"
                    />
                    <button
                      onClick={() =>
                        act(
                          () => setMeeting(order.id, meetingTime, meetingLocation),
                          'Meeting details set!',
                        )
                      }
                      disabled={isActing || !meetingTime || !meetingLocation}
                      className="w-full py-2.5 px-4 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold rounded-xl transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {isActing ? 'Saving...' : 'Confirm Meeting'}
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

type Tab = 'purchases' | 'sales';

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<Tab>('purchases');
  const [purchases, setPurchases] = useState<OrderResponse[]>([]);
  const [sales, setSales] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setFetchError(null);
    setIsLoading(true);
    try {
      const [purchasesData, salesData] = await Promise.all([
        getOrders(0, 50),
        getSales(0, 50),
      ]);
      setPurchases(purchasesData.content ?? []);
      setSales(salesData.content ?? []);
    } catch {
      setFetchError('Could not load your orders. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const displayed = activeTab === 'purchases' ? purchases : sales;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white relative overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-gray-100 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-40 left-10 w-96 h-96 bg-gray-50 rounded-full blur-3xl opacity-40" />

        <Wrapper>
          <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            {/* Header */}
            <div className="mb-8 animate-fade-in-up">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                  <Package className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
              </div>
              <p className="text-gray-600 text-sm ml-[52px]">
                Track your purchases and manage your sales
              </p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                onClick={() => setActiveTab('purchases')}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all duration-200 -mb-px ${
                  activeTab === 'purchases'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                My Purchases
                {purchases.length > 0 && (
                  <span className="ml-1 bg-gray-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {purchases.length}
                  </span>
                )}
              </button>
              <button
                onClick={() => setActiveTab('sales')}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all duration-200 -mb-px ${
                  activeTab === 'sales'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Package className="w-4 h-4" />
                My Sales
                {sales.length > 0 && (
                  <span className="ml-1 bg-gray-900 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {sales.length}
                  </span>
                )}
              </button>
            </div>

            {/* Loading */}
            {isLoading && (
              <div className="text-center py-20">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mx-auto mb-4" />
                <p className="text-gray-500 text-sm">Loading orders...</p>
              </div>
            )}

            {/* Error */}
            {fetchError && !isLoading && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <span className="text-sm text-red-800 font-medium">{fetchError}</span>
              </div>
            )}

            {/* Empty state */}
            {!isLoading && !fetchError && displayed.length === 0 && (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-50 border border-gray-200 rounded-2xl mx-auto mb-6">
                  {activeTab === 'purchases' ? (
                    <ShoppingBag className="w-8 h-8 text-gray-400" />
                  ) : (
                    <Package className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {activeTab === 'purchases' ? 'No purchases yet' : 'No sales yet'}
                </h3>
                <p className="text-gray-600 max-w-md mx-auto mb-8">
                  {activeTab === 'purchases'
                    ? 'Browse listings and add items to your cart to make your first purchase.'
                    : 'List an item to start selling.'}
                </p>
                <Link
                  href={activeTab === 'purchases' ? '/browse' : '/sell'}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-lg shadow-gray-900/10 hover:-translate-y-0.5"
                >
                  {activeTab === 'purchases' ? 'Browse Listings' : 'List an Item'}
                </Link>
              </div>
            )}

            {/* Orders list */}
            {!isLoading && !fetchError && displayed.length > 0 && (
              <div className="space-y-4">
                {displayed.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    isSale={activeTab === 'sales'}
                    onRefresh={loadData}
                  />
                ))}
              </div>
            )}
          </div>
        </Wrapper>
      </div>
    </ProtectedRoute>
  );
}
