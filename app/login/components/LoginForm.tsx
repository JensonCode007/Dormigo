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

const LoginForm = () => {
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
    w-full px-4 py-3.5 pl-12 border rounded-xl transition-all duration-200 text-sm
    focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent
    ${hasError
      ? 'border-red-500 bg-red-50'
      : 'border-gray-200 bg-gray-50 hover:border-gray-300 focus:bg-white'
    }
  `;

  const iconClasses = (hasError: boolean) => `
    absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5
    ${hasError ? 'text-red-500' : 'text-gray-400'}
  `;

  return (
    <div className="min-h-screen bg-white relative overflow-hidden animate-fade-in">
      {/* Decorative background elements */}
      <div className="absolute top-20 right-10 w-96 h-96 bg-gray-100 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-gray-50 rounded-full blur-3xl opacity-40" />

      <Wrapper>
        <div className="relative z-10 flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full">
            {/* Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 rounded-2xl mb-6">
                <div className="w-6 h-6 bg-white rounded-full"></div>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-3">
                Welcome back
              </h2>
              <p className="text-gray-600">
                Sign in to your Dormigo account
              </p>
            </div>

            {/* Form card */}
            <div className="bg-white rounded-2xl shadow-xl shadow-gray-900/5 border border-gray-200 p-8">
              <form className="space-y-5" onSubmit={handleSubmit}>
                {signupSuccess && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm text-green-800 font-medium">Account created successfully! Please sign in.</span>
                  </div>
                )}

                {errors.general && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <span className="text-sm text-red-800 font-medium">{errors.general}</span>
                  </div>
                )}

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
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
                    <p className="mt-2 text-xs text-red-600 font-medium">{errors.email}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-900 mb-2">
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
                    <p className="mt-2 text-xs text-red-600 font-medium">{errors.password}</p>
                  )}
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center">
                    <input
                      id="rememberMe"
                      name="rememberMe"
                      type="checkbox"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                    />
                    <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-gray-900 hover:text-gray-700 font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`
                      w-full flex justify-center items-center py-3.5 px-4 border border-transparent font-semibold rounded-xl text-white transition-all duration-200
                      ${isSubmitting
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gray-900 hover:bg-gray-800 shadow-lg shadow-gray-900/10 hover:shadow-xl hover:shadow-gray-900/20 hover:-translate-y-0.5'
                      }
                    `}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Signing in...
                      </div>
                    ) : (
                      'Sign In'
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Signup Link */}
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <Link
                  href="/signup"
                  className="font-semibold text-gray-900 hover:text-gray-700 transition-colors duration-200"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </Wrapper>
    </div>
  );
};

export default LoginForm;
