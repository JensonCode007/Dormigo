'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Wrapper from '@/components/magicui/Wrapper';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/lib/auth-context';
import { User, Mail, GraduationCap, Edit, ArrowLeft } from 'lucide-react';

const ProfilePage = () => {
  const router = useRouter();
  const { user } = useAuth();

  if (!user) {
    return null; // This shouldn't happen due to ProtectedRoute, but adding for safety
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Wrapper>
          <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <button
                onClick={() => router.back()}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </button>
            </div>

            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-8">
                <div className="flex items-center justify-between mb-6">
                  <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                  <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-10 h-10 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-gray-900">
                        {user.firstName} {user.lastName}
                      </h2>
                      <p className="text-gray-600">Dormigo User</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Mail className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-600">Email Address</p>
                          <p className="text-gray-900">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <GraduationCap className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-600">University</p>
                          <p className="text-gray-900">{user.university}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <User className="w-5 h-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-600">User ID</p>
                          <p className="text-gray-900 font-mono text-sm">{user.id}</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-5 h-5 bg-green-500 rounded-full"></div>
                        <div>
                          <p className="text-sm font-medium text-gray-600">Status</p>
                          <p className="text-gray-900">Active</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 bg-white shadow rounded-lg">
              <div className="px-6 py-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Account Settings</h3>
                <div className="space-y-4">
                  <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Change Password</span>
                      <span className="text-gray-400">→</span>
                    </div>
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Notification Preferences</span>
                      <span className="text-gray-400">→</span>
                    </div>
                  </button>
                  <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors duration-200">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Privacy Settings</span>
                      <span className="text-gray-400">→</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Wrapper>
      </div>
    </ProtectedRoute>
  );
};

export default ProfilePage;