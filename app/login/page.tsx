'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Wrapper from '@/components/magicui/Wrapper';
import { Eye, EyeOff, Mail, Lock, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

const LoginPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();
  const signupSuccess = searchParams.get('message') === 'signup-success';
  const redirectUrl = searchParams.get('redirect');

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear specific error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call - replace with actual login API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulate user data - in real app, this would come from the API
      const userData = {
        id: 'demo_user_123',
        email: formData.email,
        firstName: 'John', // These would come from the API response
        lastName: 'Doe',
        university: 'Demo University',
      };
      
      // Log in the user
      login(userData);
      
      // Check for redirect URL or use stored redirect
      const targetUrl = redirectUrl || localStorage.getItem('dormigo_redirect_after_login') || '/browse';
      localStorage.removeItem('dormigo_redirect_after_login');
      
      router.push(decodeURIComponent(targetUrl));
      
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: 'Invalid email or password. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = (hasError: boolean) => `
    w-full px-4 py-3 pl-12 border rounded-md transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
    ${hasError 
      ? 'border-red-500 bg-red-50' 
      : 'border-gray-300 hover:border-gray-400 focus:border-blue-500'
    }
  `;

  const iconClasses = (hasError: boolean) => `
    absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5
    ${hasError ? 'text-red-500' : 'text-gray-400'}
  `;

  return (
    <div className="min-h-screen bg-gray-50">
      <Wrapper>
        <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <h2 className="mt-6 text-3xl font-bold text-gray-900">
                Welcome back
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Sign in to your Dormigo account
              </p>
            </div>
            
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              {signupSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-green-700">Account created successfully! Please sign in.</span>
                </div>
              )}

              {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <span className="text-sm text-red-700">{errors.general}</span>
                </div>
              )}

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className={iconClasses(!!errors.email)} />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={inputClasses(!!errors.email)}
                    placeholder="john.doe@university.edu"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-xs text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className={iconClasses(!!errors.password)} />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    className={inputClasses(!!errors.password)}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-xs text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600">
                    Remember me
                  </label>
                </div>
                <Link 
                  href="/forgot-password" 
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`
                    group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white transition-colors duration-200
                    ${isSubmitting 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                    }
                  `}
                >
                  {isSubmitting ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Signing in...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </div>

              {/* Signup Link */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link 
                    href="/signup" 
                    className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                  >
                    Sign up here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </Wrapper>
    </div>
  );
};

export default LoginPage;