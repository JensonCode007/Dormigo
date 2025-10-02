'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, HelpCircle, User, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/browse', label: 'Browse' },
    { href: '/sell', label: 'Sell' },
  ];

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    router.push('/');
  };

  const handleUserMenuToggle = () => {
    setShowUserMenu(!showUserMenu);
  };

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-900 rounded-sm flex items-center justify-center">
                <div className="w-3 h-3 bg-white rounded-full"></div>
              </div>
              <Link href="/" className="text-xl font-semibold text-gray-900">
                Dormigo
              </Link>
            </div>
            <nav className="hidden md:flex space-x-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`font-medium px-3 py-2 rounded-full transition-colors text-xl ${
                      isActive ? "text-gray-900 border-b-1 border-gray-500 pb-1" : "text-gray-700 hover:text-gray-900"

                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
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
            {isAuthenticated && user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={handleUserMenuToggle}
                  className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 font-medium px-3 py-2 rounded-md transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span>{user.firstName} {user.lastName}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-100">
                      <p className="font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                      <p className="truncate">{user.email}</p>
                      <p className="text-xs text-gray-400">{user.university}</p>
                    </div>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <User className="w-4 h-4 inline mr-2" />
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center"
                    >
                      <LogOut className="w-4 h-4 inline mr-2" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link 
                  href="/signup"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
                >
                  Sign Up
                </Link>
                <Link 
                  href="/login"
                  className="text-gray-700 hover:text-gray-900 hover:bg-gray-300 font-medium px-3 py-2 rounded-md transition-colors"
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
