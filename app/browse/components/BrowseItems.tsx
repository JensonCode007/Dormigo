'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Search, Heart, ChevronDown, SlidersHorizontal } from 'lucide-react';
import { getProducts, toFrontendItem } from '@/lib/api/products';
import type { Item } from '@/lib/types';

interface BrowseItemsProps {
  initialItems?: Item[];
}

const BrowseItems: React.FC<BrowseItemsProps> = ({ initialItems = [] }) => {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [isLoading, setIsLoading] = useState(initialItems.length === 0);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    if (initialItems.length > 0) return;
    getProducts(0, 50)
      .then(page => setItems(page.content.map(toFrontendItem)))
      .catch(() => setFetchError('Could not load listings from the server.'))
      .finally(() => setIsLoading(false));
  }, [initialItems.length]);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCampus, setSelectedCampus] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());

  // Build unique category list from loaded items so options always match the data
  const uniqueCategories = Array.from(new Set(items.map(i => i.category).filter(Boolean)));

  // Filter items based on search and filters
  const filteredItems = items.filter((item: Item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    // Items from the backend have no campus field — don't hide them when a campus is selected
    const matchesCampus = selectedCampus === 'all' || !item.campus || item.campus === selectedCampus;
    const matchesPrice = item.price >= priceRange[0] && item.price <= priceRange[1];
    return matchesSearch && matchesCategory && matchesCampus && matchesPrice;
  });

  const toggleFavorite = (itemId: number): void => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(itemId)) {
        newFavorites.delete(itemId);
      } else {
        newFavorites.add(itemId);
      }
      return newFavorites;
    });
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-gray-100 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-40 left-10 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-20" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Browse Listings
          </h1>
        </div>

        {/* Search Bar */}
        <div className="mb-8 animate-fade-in-up-delay">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for items..."
              className="w-full pl-12 pr-4 py-3.5 border border-gray-200 bg-gray-50 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent focus:bg-white hover:border-gray-300 transition-all duration-200 text-sm"
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10 animate-fade-in-up-delay-2">
          <div className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 mr-1">
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </div>

          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCategory(e.target.value)}
              className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 pr-9 text-sm font-medium text-gray-700 hover:border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent focus:bg-white transition-all duration-200 cursor-pointer"
            >
              <option value="all">Category</option>
              {uniqueCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={selectedCampus}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCampus(e.target.value)}
              className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 pr-9 text-sm font-medium text-gray-700 hover:border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent focus:bg-white transition-all duration-200 cursor-pointer"
            >
              <option value="all">Campus</option>
              <option value="Onakoor">LP Campus</option>
              <option value="Warriom Road">Warriom Road Campus</option>
              <option value="Pune">Pune Campus</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={`${priceRange[0]}-${priceRange[1]}`}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                const value = e.target.value;
                switch (value) {
                  case "0-250":
                    setPriceRange([0, 250]);
                    break;
                  case "250-500":
                    setPriceRange([250, 500]);
                    break;
                  case "500-1000":
                    setPriceRange([500, 1000]);
                    break;
                  case "1000-10000":
                    setPriceRange([1000, 10000]);
                    break;
                  default:
                    setPriceRange([0, 10000]);
                }
              }}
              className="appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 pr-9 text-sm font-medium text-gray-700 hover:border-gray-300 focus:ring-2 focus:ring-gray-900 focus:border-transparent focus:bg-white transition-all duration-200 cursor-pointer"
            >
              <option value="0-10000">Price</option>
              <option value="0-250">0 - ₹250</option>
              <option value="250-500">₹250 - ₹500</option>
              <option value="500-1000">₹500 - ₹1000</option>
              <option value="1000-10000">₹1000+</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Loading / Error */}
        {isLoading && (
          <div className="text-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-900 mx-auto mb-4"></div>
            <p className="text-gray-500 text-sm">Loading listings...</p>
          </div>
        )}

        {fetchError && !isLoading && (
          <div className="text-center py-8 mb-4">
            <p className="text-red-600 text-sm">{fetchError}</p>
          </div>
        )}

        {/* Items Grid */}
        {!isLoading && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item: Item, index: number) => (
                <div
                  key={item.id}
                  className="group bg-white rounded-2xl border border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-xl hover:shadow-gray-900/5 transition-all duration-300 overflow-hidden hover:-translate-y-0.5"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      priority={index === 0}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <button
                      onClick={() => toggleFavorite(item.id)}
                      className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors shadow-sm"
                      aria-label={`Toggle favorite for ${item.title}`}
                    >
                      <Heart
                        className={`w-4 h-4 transition-colors ${
                          favorites.has(item.id) ? 'text-red-500 fill-current' : 'text-gray-400'
                        }`}
                      />
                    </button>
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-sm">
                      <span className="text-sm font-semibold text-gray-900">₹{item.price}</span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{item.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{item.condition}</p>
                    <button className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-2.5 px-4 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md hover:shadow-gray-900/10 cursor-pointer">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <div className="text-center py-20">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-50 border border-gray-200 rounded-2xl mx-auto mb-6">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">No items found</h3>
                <p className="text-gray-600 max-w-md mx-auto">Try adjusting your search or filters to discover more listings.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default BrowseItems;
