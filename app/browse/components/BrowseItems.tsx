'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Search, Heart, User, ChevronDown } from 'lucide-react';

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
      price: 45,
      image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop&crop=center",
      category: "books",
      campus: "north"
    },
    {
      id: 2,
      title: "Desk Lamp",
      condition: "Like new",
      price: 25,
      image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=300&fit=crop&crop=center",
      category: "furniture",
      campus: "south"
    },
    {
      id: 3,
      title: "Mini Fridge",
      condition: "Excellent condition",
      price: 120,
      image: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&h=300&fit=crop&crop=center",
      category: "appliances",
      campus: "east"
    },
    {
      id: 4,
      title: "Bike",
      condition: "Barely used",
      price: 80,
      image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop&crop=center",
      category: "transportation",
      campus: "west"
    },
    {
      id: 5,
      title: "Gaming Laptop",
      condition: "High-end specs",
      price: 650,
      image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=300&fit=crop&crop=center",
      category: "electronics",
      campus: "north"
    },
    {
      id: 6,
      title: "Dorm Room Decor",
      condition: "Various items",
      price: 15,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=300&fit=crop&crop=center",
      category: "decor",
      campus: "south"
    },
    {
      id: 7,
      title: "Coffee Maker",
      condition: "New",
      price: 35,
      image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop&crop=center",
      category: "appliances",
      campus: "east"
    },
    {
      id: 8,
      title: "Microwave",
      condition: "Used",
      price: 60,
      image: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&h=300&fit=crop&crop=center",
      category: "appliances",
      campus: "west"
    }
  ]);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCampus, setSelectedCampus] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
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

  const handlePriceRangeChange = (value: string): void => {
    setPriceRange([priceRange[0], parseInt(value)]);
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for items..."
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-8">
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCategory(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
            >
              <option value="all">Category</option>
              <option value="books">Books</option>
              <option value="furniture">Furniture</option>
              <option value="electronics">Electronics</option>
              <option value="appliances">Appliances</option>
              <option value="transportation">Transportation</option>
              <option value="decor">Decor</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={selectedCampus}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedCampus(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
            >
              <option value="all">Campus</option>
              <option value="north">North Campus</option>
              <option value="south">South Campus</option>
              <option value="east">East Campus</option>
              <option value="west">West Campus</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>

         {/* Price Filter Dropdown */}
<div className="relative">
  <select
    value={`${priceRange[0]}-${priceRange[1]}`}
    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
      const value = e.target.value;
      switch (value) {
        case "0-25":
          setPriceRange([0, 25]);
          break;
        case "25-50":
          setPriceRange([25, 50]);
          break;
        case "50-100":
          setPriceRange([50, 100]);
          break;
        case "100-1000":
          setPriceRange([100, 1000]);
          break;
        default:
          setPriceRange([0, 1000]); // "all"
      }
    }}
    className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer"
  >
    <option value="0-1000">Price</option>
    <option value="0-25">$0 - $25</option>
    <option value="25-50">$25 - $50</option>
    <option value="50-100">$50 - $100</option>
    <option value="100-1000">$100+</option>
  </select>
  <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
</div>

{/* Price Range Slider */}
<div className="mb-8">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Price Range
  </label>
  <div className="flex items-center space-x-4">
    <span className="text-sm text-gray-600">${priceRange[0]}</span>
    <div className="flex-1">
      <input
        type="range"
        min="0"
        max="1000"
        step="10"
        value={priceRange[1]}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          const newMax = parseInt(e.target.value);
          setPriceRange([priceRange[0], newMax]);
        }}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      />
    </div>
    <span className="text-sm text-gray-600">${priceRange[1]}</span>
  </div>
</div>
</div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item: Item, index: number) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
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
                  className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
                  aria-label={`Toggle favorite for ${item.title}`}
                >
                  <Heart
                    className={`w-4 h-4 transition-colors ${
                      favorites.has(item.id) ? 'text-red-500 fill-current' : 'text-gray-400'
                    }`}
                  />
                </button>
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                  <span className="text-xs font-medium text-gray-900">${item.price}</span>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{item.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{item.condition}</p>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No items found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrowseItems;

