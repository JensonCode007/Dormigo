'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Wrapper from '@/components/magicui/Wrapper';
import { ArrowRight, Sparkles, ShieldCheck, Zap, Users, Package, TrendingUp } from 'lucide-react';

const HeroSection = () => {
  const router = useRouter();

  return (
    <section className="relative min-h-[90vh] bg-white overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-50" />
      
      {/* Decorative elements */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-gray-100 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-20" />
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[90vh] px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-full mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">Your Campus Marketplace</span>
          </div>
          
          {/* Hero headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight tracking-tight animate-fade-in-up">
            Buy, Sell, Trade.
            <br />
            <span className="text-gray-400">Just for Campus.</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed animate-fade-in-up-delay">
            Join your campus community in a trusted marketplace designed for students. 
            Find deals, declutter your dorm, and connect with classmates.
          </p>
          
          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up-delay-2">
            <button 
              onClick={() => router.push('/browse')}
              className="group relative px-8 py-4 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-all duration-300 text-lg cursor-pointer shadow-lg shadow-gray-900/10 hover:shadow-xl hover:shadow-gray-900/20 hover:-translate-y-0.5 flex items-center gap-2"
            >
              Browse Listings
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => router.push('/sell')}
              className="px-8 py-4 bg-white text-gray-900 border-2 border-gray-200 rounded-xl font-medium hover:border-gray-900 transition-all duration-300 text-lg cursor-pointer hover:-translate-y-0.5"
            >
              Post an Item
            </button>
          </div>
          
          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 max-w-2xl mx-auto animate-fade-in-up-delay-3">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">500+</div>
              <div className="text-sm text-gray-600 mt-1">Active Listings</div>
            </div>
            <div className="text-center border-x border-gray-200">
              <div className="text-3xl font-bold text-gray-900">1,200+</div>
              <div className="text-sm text-gray-600 mt-1">Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900">98%</div>
              <div className="text-sm text-gray-600 mt-1">Satisfaction</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FeaturesSection = () => {
  const features = [
    {
      icon: ShieldCheck,
      title: 'Campus Verified',
      description: 'Only verified students from your campus can join. Safe and trusted transactions.'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'List items in seconds. Browse and connect with sellers instantly.'
    },
    {
      icon: Users,
      title: 'Community First',
      description: 'Built for students, by students. Support your campus community.'
    }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Choose Dormigo?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Everything you need for seamless campus commerce.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-8 bg-gray-50 rounded-2xl hover:bg-white hover:shadow-xl hover:shadow-gray-900/5 transition-all duration-300 border border-transparent hover:border-gray-200"
            >
              <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const HowItWorksSection = () => {
  const steps = [
    {
      icon: Package,
      title: 'List Your Item',
      description: 'Take a photo, add details, and publish in under a minute.'
    },
    {
      icon: Users,
      title: 'Connect With Buyers',
      description: 'Chat with interested students directly through the platform.'
    },
    {
      icon: TrendingUp,
      title: 'Complete The Deal',
      description: 'Meet up safely on campus and complete your transaction.'
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Getting started is simple. Join thousands of students already using Dormigo.
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-12 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gray-200 to-transparent" 
               style={{ top: '48px' }} />
          
          {steps.map((step, index) => (
            <div key={index} className="relative text-center">
              <div className="inline-flex items-center justify-center w-24 h-24 bg-white border-4 border-gray-100 rounded-2xl mb-6 relative z-10 shadow-lg">
                <step.icon className="w-10 h-10 text-gray-900" />
              </div>
              <div className="absolute top-8 left-1/2 -translate-x-1/2 w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center text-sm font-bold z-20">
                {index + 1}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {step.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CTASection = () => {
  const router = useRouter();
  
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS13aWR0aD0iMC41IiBvcGFjaXR5PSIwLjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-20" />
      
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
          Ready to Get Started?
        </h2>
        <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
          Join your campus marketplace today and discover amazing deals from fellow students.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button 
            onClick={() => router.push('/signup')}
            className="px-8 py-4 bg-white text-gray-900 rounded-xl font-medium hover:bg-gray-100 transition-all duration-300 text-lg cursor-pointer shadow-xl hover:-translate-y-0.5"
          >
            Create Account
          </button>
          <button 
            onClick={() => router.push('/browse')}
            className="px-8 py-4 bg-transparent text-white border-2 border-white rounded-xl font-medium hover:bg-white hover:text-gray-900 transition-all duration-300 text-lg cursor-pointer hover:-translate-y-0.5"
          >
            Explore Listings
          </button>
        </div>
      </div>
    </section>
  );
};

const DormigoHomepage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Wrapper>
        <HeroSection />
        <FeaturesSection />
        <HowItWorksSection />
        <CTASection />
      </Wrapper>
    </div>
  );
};

export default DormigoHomepage;