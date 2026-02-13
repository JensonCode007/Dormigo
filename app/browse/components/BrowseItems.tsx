'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Search, Heart, ChevronDown, SlidersHorizontal } from 'lucide-react';

// TypeScript interfaces
interface Item {
  id: number;
  title: string;
  condition: string;
  price: number;
  image: string;
  category: string;
  campus?: string;
}

interface BrowseItemsProps {
  initialItems?: Item[];
}

const BrowseItems: React.FC<BrowseItemsProps> = ({ initialItems = [] }) => {
  const [items] = useState<Item[]>(initialItems.length > 0 ? initialItems : [
    {
      id: 1,
      title: "Textbook: Calculus 101",
      condition: "Used, good condition",
      price: 250,
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop&crop=center",
      category: "books",
      campus: "Onakoor"
    },
    {
      id: 2,
      title: "Desk Lamp",
      condition: "Like new",
      price: 750,
      image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=300&fit=crop&crop=center",
      category: "furniture",
      campus: "Warriom Road"
    },
    {
      id: 3,
      title: "Mini Fridge",
      condition: "Excellent condition",
      price: 3200,
      image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=300&fit=crop&crop=center",
      category: "appliances",
      campus: "Warriom Road"
    },
    {
      id: 4,
      title: "Bike",
      condition: "Barely used",
      price: 2600,
      image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop&crop=center",
      category: "transportation",
      campus: "Onakoor"
    },
    {
      id: 5,
      title: "Gaming Laptop",
      condition: "High-end specs",
      price: 65000,
      image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=300&fit=crop&crop=center",
      category: "electronics",
      campus: "Onakoor"
    },
    {
      id: 6,
      title: "Dorm Room Decor",
      condition: "Various items",
      price: 6000,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=center",
      category: "decor",
      campus: "Pune"
    },
    {
      id: 7,
      title: "Coffee Maker",
      condition: "New",
      price: 3500,
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop&crop=center",
      category: "appliances",
      campus: "Onakoor"
    },
    {
      id: 8,
      title: "Microwave",
      condition: "Used",
      price: 3200,
      image: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=300&fit=crop&crop=center",
      category: "appliances",
      campus: "Warriom Road"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCampus, setSelectedCampus] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());


  // Filter items based on search and filters
  const filteredItems = items.filter((item: Item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesCampus = selectedCampus === 'all' || item.campus === selectedCampus;
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
              <option value="books">Books</option>
              <option value="furniture">Furniture</option>
              <option value="electronics">Electronics</option>
              <option value="appliances">Appliances</option>
              <option value="transportation">Transportation</option>
              <option value="decor">Decor</option>
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

        {/* Items Grid */}
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
      </div>
    </div>
  );
};

export default BrowseItems;
