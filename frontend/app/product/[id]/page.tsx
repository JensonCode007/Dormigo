'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Wrapper from '@/components/magicui/Wrapper';
import {
  ArrowLeft,
  ShoppingCart,
  User,
  Tag,
  Package,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { getProductById, type ProductResponse } from '@/lib/api/products';
import { addToCart } from '@/lib/api/cart';
import { ApiError } from '@/lib/api/client';
import { useAuth } from '@/lib/auth-context';

const CONDITION_LABELS: Record<string, string> = {
  NEW: 'New',
  LIKE_NEW: 'Like New',
  GOOD: 'Good',
  FAIR: 'Fair',
  POOR: 'Poor',
};

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [cartSuccess, setCartSuccess] = useState(false);
  const [cartError, setCartError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    getProductById(Number(id))
      .then((p) => {
        setProduct(p);
        setSelectedImage(p.primaryImage ?? p.productImages?.[0] ?? null);
      })
      .catch(() => setFetchError('Could not load this product. It may have been removed.'))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(`/product/${id}`)}`);
      return;
    }
    setIsAddingToCart(true);
    setCartError(null);
    setCartSuccess(false);
    try {
      await addToCart(Number(id), 1);
      setCartSuccess(true);
    } catch (error) {
      if (error instanceof ApiError) {
        setCartError(error.message || 'Could not add item to cart.');
      } else {
        setCartError('Unable to connect to the server.');
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  const placeholderImage =
    'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=450&fit=crop';

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <div className="absolute top-20 right-10 w-72 h-72 bg-gray-100 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-40 left-10 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-20" />

      <Wrapper>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Browse
          </button>

          {/* Loading */}
          {isLoading && (
            <div className="text-center py-24">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mx-auto mb-4" />
              <p className="text-gray-500 text-sm">Loading product...</p>
            </div>
          )}

          {/* Error */}
          {fetchError && !isLoading && (
            <div className="text-center py-24">
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md mx-auto flex items-center space-x-3">
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-800 font-medium">{fetchError}</p>
              </div>
              <Link
                href="/browse"
                className="mt-6 inline-block text-sm font-medium text-gray-900 underline"
              >
                Go back to Browse
              </Link>
            </div>
          )}

          {/* Product */}
          {!isLoading && product && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-fade-in-up">
              {/* Image gallery */}
              <div>
                <div className="relative aspect-square rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 shadow-sm mb-4">
                  <Image
                    src={selectedImage ?? placeholderImage}
                    alt={product.title}
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
                {product.productImages && product.productImages.length > 1 && (
                  <div className="flex gap-3 flex-wrap">
                    {product.productImages.map((img, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedImage(img)}
                        className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                          selectedImage === img
                            ? 'border-gray-900'
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        <Image
                          src={img}
                          alt={`${product.title} ${i + 1}`}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product info */}
              <div className="flex flex-col">
                {/* Category badge */}
                {product.categoryName && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 bg-gray-100 rounded-full px-3 py-1.5 w-fit mb-4">
                    <Tag className="w-3 h-3" />
                    {product.categoryName}
                  </span>
                )}

                <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">
                  {product.title}
                </h1>

                <div className="flex items-center gap-4 mb-6">
                  <span className="text-4xl font-bold text-gray-900">
                    ₹{Number(product.price).toLocaleString()}
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-700 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5">
                    <Package className="w-4 h-4 text-gray-400" />
                    {CONDITION_LABELS[product.condition] ?? product.condition}
                  </span>
                  {!product.isAvailable && (
                    <span className="text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-1.5">
                      Sold
                    </span>
                  )}
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>

                {/* Seller */}
                <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Listed by</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {product.seller?.firstName} {product.seller?.lastName}
                      </p>
                      <p className="text-xs text-gray-500">{product.seller?.email}</p>
                    </div>
                  </div>
                </div>

                {/* Cart feedback */}
                {cartSuccess && (
                  <div className="mb-4 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm text-green-800 font-medium">
                      Added to cart!{' '}
                      <Link href="/cart" className="underline font-semibold">
                        View cart
                      </Link>
                    </span>
                  </div>
                )}
                {cartError && (
                  <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <span className="text-sm text-red-800 font-medium">{cartError}</span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-col gap-3 mt-auto">
                  <button
                    onClick={handleAddToCart}
                    disabled={isAddingToCart || !product.isAvailable}
                    className={`w-full flex justify-center items-center gap-2 py-3.5 px-4 font-semibold rounded-xl text-white transition-all duration-200 ${
                      isAddingToCart || !product.isAvailable
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gray-900 hover:bg-gray-800 shadow-lg shadow-gray-900/10 hover:shadow-xl hover:shadow-gray-900/20 hover:-translate-y-0.5 cursor-pointer'
                    }`}
                  >
                    {isAddingToCart ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                        Adding...
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        {product.isAvailable
                          ? isAuthenticated
                            ? 'Add to Cart'
                            : 'Login to Add to Cart'
                          : 'Item Unavailable'}
                      </>
                    )}
                  </button>
                  <Link
                    href="/browse"
                    className="w-full flex justify-center items-center py-3 px-4 font-medium rounded-xl text-gray-700 bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-200 text-sm"
                  >
                    Continue Browsing
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </Wrapper>
    </div>
  );
}
