'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Wrapper from '@/components/magicui/Wrapper';
import { Eye, EyeOff, User, Mail, Lock, GraduationCap, AlertCircle, CheckCircle } from 'lucide-react';
import { signupApi } from '@/lib/api/auth';
import { ApiError } from '@/lib/api/client';

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

    // Password validation (must match backend: digit, lowercase, uppercase, special char)
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@#$%^&+=)';
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
      await signupApi(
        formData.firstName,
        formData.lastName,
        formData.email,
        formData.password,
      );

      setSubmitStatus('success');

      // Backend doesn't return a token on signup — redirect to login
      setTimeout(() => {
        router.push('/login?message=signup-success');
      }, 1500);

    } catch (error) {
      setSubmitStatus('error');
      if (error instanceof ApiError) {
        setErrors({ general: error.message || 'Signup failed. Please try again.' });
      } else {
        setErrors({ general: 'Unable to connect to the server. Please try again.' });
      }
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
                Create your account
              </h2>
              <p className="text-gray-600">
                Join Dormigo and start trading on campus
              </p>
            </div>
            
            {/* Form card */}
            <div className="bg-white rounded-2xl shadow-xl shadow-gray-900/5 border border-gray-200 p-8">
              <form className="space-y-5" onSubmit={handleSubmit}>
                {errors.general && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                    <span className="text-sm text-red-800 font-medium">{errors.general}</span>
                  </div>
                )}

                {submitStatus === 'success' && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="text-sm text-green-800 font-medium">Account created successfully! Redirecting to dashboard...</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  {/* First Name */}
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-semibold text-gray-900 mb-2">
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
                      <p className="mt-2 text-xs text-red-600 font-medium">{errors.firstName}</p>
                    )}
                  </div>

                  {/* Last Name */}
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-semibold text-gray-900 mb-2">
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
                      <p className="mt-2 text-xs text-red-600 font-medium">{errors.lastName}</p>
                    )}
                  </div>
                </div>

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

                {/* University */}
                <div>
                  <label htmlFor="university" className="block text-sm font-semibold text-gray-900 mb-2">
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
                    <p className="mt-2 text-xs text-red-600 font-medium">{errors.university}</p>
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
                    <p className="mt-2 text-xs text-red-600 font-medium">{errors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-900 mb-2">
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
                    <p className="mt-2 text-xs text-red-600 font-medium">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Terms Agreement */}
                <div className="pt-1">
                  <div className="flex items-start">
                    <input
                      id="agreeToTerms"
                      name="agreeToTerms"
                      type="checkbox"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      className="mt-1 h-4 w-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                    />
                    <label htmlFor="agreeToTerms" className="ml-3 text-sm text-gray-700">
                      I agree to the{' '}
                      <Link href="/terms" className="text-gray-900 hover:text-gray-700 underline font-medium">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" className="text-gray-900 hover:text-gray-700 underline font-medium">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>
                  {errors.agreeToTerms && (
                    <p className="mt-2 text-xs text-red-600 font-medium">{errors.agreeToTerms}</p>
                  )}
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
                        Creating Account...
                      </div>
                    ) : (
                      'Create Account'
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Login Link */}
            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link 
                  href="/login" 
                  className="font-semibold text-gray-900 hover:text-gray-700 transition-colors duration-200"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </Wrapper>
    </div>
  );
};

export default SignUpPage;