import React from 'react';
import Link from 'next/link';
import Wrapper from '@/components/magicui/Wrapper';
import { ArrowLeft, Lock } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <Wrapper>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <Link
              href="/signup"
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Link>
          </div>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
              <p className="text-sm text-gray-500 mt-0.5">Last updated: February 2026</p>
            </div>
          </div>

          <div className="prose prose-gray max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Information We Collect</h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-3">
                When you create a Dormigo account, we collect:
              </p>
              <ul className="text-sm text-gray-600 leading-relaxed space-y-2 list-none">
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-1">•</span>
                  <strong>Account information:</strong> First name, last name, email address, and hashed password.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-1">•</span>
                  <strong>Listing information:</strong> Item titles, descriptions, prices, photos, and condition details you submit.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-1">•</span>
                  <strong>Transaction data:</strong> Orders, cart activity, meeting times, and locations you provide.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-1">•</span>
                  <strong>Device information:</strong> IP address and device type, used for security and fraud prevention.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">2. How We Use Your Information</h2>
              <ul className="text-sm text-gray-600 leading-relaxed space-y-2 list-none">
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-1">•</span>
                  To create and manage your account and provide access to the platform.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-1">•</span>
                  To display your listings to other users on the platform.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-1">•</span>
                  To facilitate transactions between buyers and sellers, including OTP generation and email notifications.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-1">•</span>
                  To detect and prevent fraudulent activity.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Data Sharing</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                We do not sell your personal information. We share limited data with third-party services
                necessary to operate the platform:
              </p>
              <ul className="text-sm text-gray-600 leading-relaxed space-y-2 list-none mt-3">
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-1">•</span>
                  <strong>Cloudinary:</strong> For hosting and delivering product images you upload.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-1">•</span>
                  <strong>Email provider (Gmail SMTP):</strong> For sending transaction notifications and OTPs.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Data Security</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Your password is stored as a bcrypt hash and is never accessible in plain text. All API
                communication is performed over HTTPS. JWT tokens are used for session authentication and
                are stored client-side in your browser&apos;s local storage.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Data Retention</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                We retain your account and listing data for as long as your account is active. You may
                request deletion of your account and associated data by contacting us at the email below.
                Completed order records may be retained for fraud prevention purposes.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Your Rights</h2>
              <ul className="text-sm text-gray-600 leading-relaxed space-y-2 list-none">
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-1">•</span>
                  Access the personal data we hold about you.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-1">•</span>
                  Request correction of inaccurate data.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-1">•</span>
                  Request deletion of your account and data.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Cookies and Local Storage</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Dormigo uses browser local storage to persist your authentication token and session data.
                No tracking cookies are used. You can clear this data at any time through your browser settings
                or by logging out of the platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Contact</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                For privacy-related questions or data requests, contact us at{' '}
                <span className="font-medium text-gray-900">dormigoservice@gmail.com</span>.
              </p>
            </section>
          </div>
        </div>
      </Wrapper>
    </div>
  );
}
