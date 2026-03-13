'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Wrapper from '@/components/magicui/Wrapper';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import {
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  type CartResponse,
  type CartItemResponse,
} from '@/lib/api/cart';
import { createOrder } from '@/lib/api/orders';
import { ApiError } from '@/lib/api/client';

const placeholderImage =
  'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200&h=200&fit=crop';

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [updatingItemId, setUpdatingItemId] = useState<number | null>(null);

  const loadCart = useCallback(async () => {
    setFetchError(null);
    try {
      const data = await getCart();
      setCart(data);
    } catch {
      setFetchError('Could not load your cart. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  const handleQuantityChange = async (item: CartItemResponse, delta: number) => {
    const newQty = item.quantity + delta;
    if (newQty < 1) {
      await handleRemove(item.id);
      return;
    }
    setUpdatingItemId(item.id);
    setActionError(null);
    try {
      await updateCartItem(item.id, newQty);
      await loadCart();
    } catch {
      setActionError('Could not update quantity. Please try again.');
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleRemove = async (cartItemId: number) => {
    setUpdatingItemId(cartItemId);
    setActionError(null);
    try {
      await removeCartItem(cartItemId);
      await loadCart();
    } catch {
      setActionError('Could not remove item. Please try again.');
    } finally {
      setUpdatingItemId(null);
    }
  };

  const handleClearCart = async () => {
    setActionError(null);
    try {
      await clearCart();
      await loadCart();
    } catch {
      setActionError('Could not clear cart. Please try again.');
    }
  };

  const handlePlaceOrder = async () => {
    setIsPlacingOrder(true);
    setActionError(null);
    setActionSuccess(null);
    try {
      await createOrder();
      setActionSuccess('Order placed successfully!');
      await loadCart();
      setTimeout(() => {
        router.push('/orders');
      }, 1500);
    } catch (error) {
      if (error instanceof ApiError) {
        setActionError(error.message || 'Could not place order. Please try again.');
      } else {
        setActionError('Unable to connect to the server.');
      }
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const cartItems = cart?.cartItems ?? [];
  const total = cart?.totalPrice ?? 0;

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white relative overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-gray-100 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-40 left-10 w-96 h-96 bg-gray-50 rounded-full blur-3xl opacity-40" />

        <Wrapper>
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            {/* Header */}
            <div className="mb-8">
              <button
                onClick={() => router.back()}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 mb-6"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </button>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
                </div>
                {cartItems.length > 0 && (
                  <button
                    onClick={handleClearCart}
                    className="text-sm text-gray-500 hover:text-red-600 transition-colors duration-200 font-medium"
                  >
                    Clear Cart
                  </button>
                )}
              </div>
            </div>

            {/* Loading */}
            {isLoading && (
              <div className="text-center py-24">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mx-auto mb-4" />
                <p className="text-gray-500 text-sm">Loading your cart...</p>
              </div>
            )}

            {/* Fetch Error */}
            {fetchError && !isLoading && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3 mb-6">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <span className="text-sm text-red-800 font-medium">{fetchError}</span>
              </div>
            )}

            {/* Action feedback */}
            {actionSuccess && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3 mb-6">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                <span className="text-sm text-green-800 font-medium">{actionSuccess}</span>
              </div>
            )}
            {actionError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3 mb-6">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <span className="text-sm text-red-800 font-medium">{actionError}</span>
              </div>
            )}

            {/* Empty Cart */}
            {!isLoading && !fetchError && cartItems.length === 0 && (
              <div className="text-center py-24">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-50 border border-gray-200 rounded-2xl mx-auto mb-6">
                  <ShoppingCart className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Your cart is empty</h3>
                <p className="text-gray-600 max-w-md mx-auto mb-8">
                  Browse listings and add items to your cart to get started.
                </p>
                <Link
                  href="/browse"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-lg shadow-gray-900/10 hover:-translate-y-0.5"
                >
                  Browse Listings
                </Link>
              </div>
            )}

            {/* Cart Items */}
            {!isLoading && cartItems.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Items list */}
                <div className="lg:col-span-2 space-y-4">
                  {cartItems.map((item) => {
                    const img = item.productImage ?? placeholderImage;
                    return (
                      <div
                        key={item.id}
                        className="bg-white rounded-2xl border border-gray-200 p-4 flex gap-4 hover:border-gray-300 transition-all duration-200 shadow-sm"
                      >
                        <Link href={`/product/${item.productId}`} className="flex-shrink-0">
                          <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                            <Image
                              src={img}
                              alt={item.productTitle}
                              fill
                              sizes="80px"
                              className="object-cover"
                            />
                          </div>
                        </Link>

                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/product/${item.productId}`}
                            className="font-semibold text-gray-900 hover:text-gray-700 text-sm line-clamp-2 block"
                          >
                            {item.productTitle}
                          </Link>
                          <p className="text-base font-bold text-gray-900 mt-1">
                            ₹{Number(item.price).toLocaleString()}
                          </p>
                        </div>

                        <div className="flex flex-col items-end gap-2">
                          <button
                            onClick={() => handleRemove(item.id)}
                            disabled={updatingItemId === item.id}
                            className="text-gray-400 hover:text-red-600 transition-colors duration-200"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                          <div className="flex items-center gap-2 mt-auto">
                            <button
                              onClick={() => handleQuantityChange(item, -1)}
                              disabled={updatingItemId === item.id}
                              className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:border-gray-400 hover:bg-gray-50 transition-all disabled:opacity-50"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-sm font-semibold text-gray-900 w-6 text-center">
                              {updatingItemId === item.id ? (
                                <span className="inline-block w-3 h-3 border-b border-gray-900 rounded-full animate-spin" />
                              ) : (
                                item.quantity
                              )}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item, 1)}
                              disabled={updatingItemId === item.id}
                              className="w-7 h-7 rounded-lg border border-gray-200 flex items-center justify-center hover:border-gray-400 hover:bg-gray-50 transition-all disabled:opacity-50"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Order Summary */}
                <div className="lg:col-span-1">
                  <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm sticky top-24">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">
                          Subtotal ({cartItems.length} item{cartItems.length !== 1 ? 's' : ''})
                        </span>
                        <span className="font-medium text-gray-900">
                          ₹{Number(total).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Platform Fee</span>
                        <span className="font-medium text-green-600">Free</span>
                      </div>
                    </div>
                    <div className="border-t border-gray-200 pt-4 mb-6">
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-900">Total</span>
                        <span className="text-xl font-bold text-gray-900">
                          ₹{Number(total).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={isPlacingOrder}
                      className={`w-full flex justify-center items-center gap-2 py-3.5 px-4 font-semibold rounded-xl text-white transition-all duration-200 ${
                        isPlacingOrder
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-gray-900 hover:bg-gray-800 shadow-lg shadow-gray-900/10 hover:shadow-xl hover:shadow-gray-900/20 hover:-translate-y-0.5 cursor-pointer'
                      }`}
                    >
                      {isPlacingOrder ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                          Placing Order...
                        </>
                      ) : (
                        'Place Order'
                      )}
                    </button>
                    <Link
                      href="/browse"
                      className="mt-3 w-full flex justify-center items-center py-3 px-4 text-sm font-medium rounded-xl text-gray-700 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
                    >
                      Continue Shopping
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Wrapper>
      </div>
    </ProtectedRoute>
  );
}
