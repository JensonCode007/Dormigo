'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Wrapper from '@/components/magicui/Wrapper';

const HeroSection = () => {
  const router = useRouter();

  const handleBrowseClick = () => {
    router.push('/browse');
  };

  const handlePostItemClick = () => {
    router.push('/sell');
  };

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
          <h1 className="text-4xl p-6 md:text-5xl font-bold text-black mb-6 leading-tight bg-white rounded-[75px]">
            Buy, Sell, and Trade. Just for Campus.
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button 
              onClick={handleBrowseClick}
              className="bg-blue-600 text-white px-8 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors text-lg cursor-pointer"
            >
              Browse Listings
            </button>
            <button 
              onClick={handlePostItemClick}
              className="bg-white text-gray-900 px-8 py-3 rounded-md font-medium hover:bg-gray-200 transition-colors text-lg cursor-pointer"
            >
              Post an Item
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

const DormigoHomepage = () => {
  return (
    <>
    <div className="min-h-screen bg-white">
      <Wrapper>
        <HeroSection />
      </Wrapper>
    </div>
    </>
  );
};

export default DormigoHomepage;