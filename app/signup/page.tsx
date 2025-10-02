'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Wrapper from '@/components/magicui/Wrapper';
import { Eye, EyeOff, User, Mail, Lock, GraduationCap, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  university: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  university?: string;
  password?: string;
  confirmPassword?: string;
  agreeToTerms?: string;
  general?: string;
}

const SignUpPage = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    university: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // University validation
    if (!formData.university.trim()) {
      newErrors.university = 'University is required';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    // Terms agreement validation
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the Terms of Service and Privacy Policy';
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
    setSubmitStatus('idle');

    try {
      // Simulate API call - replace with actual signup API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create user object from form data
      const newUser = {
        id: `user_${Date.now()}`, // In real app, this would come from the API
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        university: formData.university,
      };
      
      // Log in the user immediately after successful signup
      login(newUser);
      setSubmitStatus('success');
      
      // Check if there's a redirect URL stored
      const redirectUrl = localStorage.getItem('dormigo_redirect_after_login');
      localStorage.removeItem('dormigo_redirect_after_login');
      
      // Redirect to intended page or dashboard
      setTimeout(() => {
        router.push(redirectUrl || '/browse');
      }, 1500);
      
    } catch (error) {
      console.error('Signup error:', error);
      setSubmitStatus('error');
      setErrors({ general: 'An error occurred during signup. Please try again.' });
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
                Create your account
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Join Dormigo and start trading on campus
              </p>
            </div>
            
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              {errors.general && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center space-x-2">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <span className="text-sm text-red-700">{errors.general}</span>
                </div>
              )}

              {submitStatus === 'success' && (
                <div className="bg-green-50 border border-green-200 rounded-md p-4 flex items-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm text-green-700">Account created successfully! Redirecting to dashboard...</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {/* First Name */}
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <div className="relative">
                    <User className={iconClasses(!!errors.firstName)} />
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={inputClasses(!!errors.firstName)}
                      placeholder="John"
                    />
                  </div>
                  {errors.firstName && (
                    <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <div className="relative">
                    <User className={iconClasses(!!errors.lastName)} />
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={inputClasses(!!errors.lastName)}
                      placeholder="Doe"
                    />
                  </div>
                  {errors.lastName && (
                    <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>
                  )}
                </div>
              </div>

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

              {/* University */}
              <div>
                <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-1">
                  University
                </label>
                <div className="relative">
                  <GraduationCap className={iconClasses(!!errors.university)} />
                  <input
                    id="university"
                    name="university"
                    type="text"
                    value={formData.university}
                    onChange={handleInputChange}
                    className={inputClasses(!!errors.university)}
                    placeholder="Your University Name"
                  />
                </div>
                {errors.university && (
                  <p className="mt-1 text-xs text-red-600">{errors.university}</p>
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
                    placeholder="Create a strong password"
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

              {/* Confirm Password */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className={iconClasses(!!errors.confirmPassword)} />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={inputClasses(!!errors.confirmPassword)}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Terms Agreement */}
              <div className="flex items-start">
                <input
                  id="agreeToTerms"
                  name="agreeToTerms"
                  type="checkbox"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="agreeToTerms" className="ml-3 text-sm text-gray-600">
                  I agree to the{' '}
                  <Link href="/terms" className="text-blue-600 hover:text-blue-500 underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-blue-600 hover:text-blue-500 underline">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              {errors.agreeToTerms && (
                <p className="text-xs text-red-600">{errors.agreeToTerms}</p>
              )}

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
                      Creating Account...
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </div>

              {/* Login Link */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link 
                    href="/login" 
                    className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200"
                  >
                    Sign in here
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

export default SignUpPage;