import React from 'react';
import { Search} from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-900 rounded-sm flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
              <span className="text-xl font-semibold text-gray-900">Dormigo</span>
            </div>
            
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 font-medium px-3 py-2 rounded-full transition-colors text-xl">Home</a>
              <a href="#" className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 font-medium px-3 py-2 rounded-full transition-colors text-xl">Browse</a>
              <a href="#" className="text-gray-700 hover:text-gray-900 hover:bg-gray-100 font-medium px-3 py-2 rounded-full transition-colors text-xl">Sell</a>
            </nav>
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors">
              Sign Up
            </button>
            <button className="text-gray-700 hover:text-gray-900 hover:bg-gray-300 font-medium px-3 py-2 rounded-md transition-colors">
              Login
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

const HeroSection = () => {
  return (
    <section className="relative min-h-screen bg-gray-100 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-7 bg-center bg-no-repeat rounded-md"
        style={{
          backgroundImage: "url('/Background_illustration.png')"
        }}
      >
        <div className="absolute inset-0 bg-opacity-20"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl p-6 md:text-5xl font-bold text-black mb-6 leading-tight bg-white rounded-[75]">
            Buy, Sell, and Trade. Just for Campus.
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors text-lg">
              Browse Listings
            </button>
            <button className="bg-white text-gray-900 px-8 py-3 rounded-md font-medium hover:bg-gray-200 transition-colors text-lg">
              Post an Item
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

// Main App Component
const DormigoHomepage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
    </div>
  );
};

export default DormigoHomepage;