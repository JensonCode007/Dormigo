'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Wrapper from '@/components/magicui/Wrapper';
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';
import { apiFetch } from '@/lib/api/client';
import { ApiError } from '@/lib/api/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    setIsSubmitting(true);
    setError(null);
    try {
      await apiFetch('/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
        skipAuth: true,
      });
      setSent(true);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        // Still show success to prevent user enumeration
        setSent(true);
      } else if (err instanceof ApiError && err.status >= 500) {
        setError('Server error. Please try again later.');
      } else {
        // For any other error (including network errors), show success
        // so we don't reveal whether the email exists
        setSent(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden animate-fade-in">
      <div className="absolute top-20 right-10 w-96 h-96 bg-gray-100 rounded-full blur-3xl opacity-30" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-gray-50 rounded-full blur-3xl opacity-40" />

      <Wrapper>
        <div className="relative z-10 flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full">
            {/* Back link */}
            <div className="mb-8">
              <Link
                href="/login"
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Login
              </Link>
            </div>

            {/* Header */}
            <div className="text-center mb-10">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-900 rounded-2xl mb-6">
                <Mail className="w-7 h-7 text-white" />
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-3">Reset Password</h2>
              <p className="text-gray-600">
                Enter your email and we&apos;ll send you a reset link.
              </p>
            </div>

            {/* Form card */}
            <div className="bg-white rounded-2xl shadow-xl shadow-gray-900/5 border border-gray-200 p-8">
              {sent ? (
                <div className="text-center py-4">
                  <div className="inline-flex items-center justify-center w-14 h-14 bg-green-50 border border-green-200 rounded-2xl mb-4">
                    <CheckCircle className="w-7 h-7 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Check your email</h3>
                  <p className="text-sm text-gray-600 mb-6">
                    If an account exists for <span className="font-medium text-gray-900">{email}</span>,
                    you will receive a password reset link shortly.
                  </p>
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center w-full py-3.5 px-4 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-gray-900/10 hover:-translate-y-0.5"
                  >
                    Return to Login
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center space-x-3">
                      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                      <span className="text-sm text-red-800 font-medium">{error}</span>
                    </div>
                  )}

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-900 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          setError(null);
                        }}
                        placeholder="john.doe@university.edu"
                        className="w-full px-4 py-3.5 pl-12 border rounded-xl transition-all duration-200 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent border-gray-200 bg-gray-50 hover:border-gray-300 focus:bg-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full flex justify-center items-center py-3.5 px-4 font-semibold rounded-xl text-white transition-all duration-200 ${
                        isSubmitting
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-gray-900 hover:bg-gray-800 shadow-lg shadow-gray-900/10 hover:shadow-xl hover:shadow-gray-900/20 hover:-translate-y-0.5'
                      }`}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                          Sending...
                        </div>
                      ) : (
                        'Send Reset Link'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </Wrapper>
    </div>
  );
}
