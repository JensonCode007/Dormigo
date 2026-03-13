import React from 'react';
import Link from 'next/link';
import Wrapper from '@/components/magicui/Wrapper';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

export default function TermsPage() {
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
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
              <p className="text-sm text-gray-500 mt-0.5">Last updated: February 2026</p>
            </div>
          </div>

          <div className="prose prose-gray max-w-none space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                By accessing or using Dormigo, you agree to be bound by these Terms of Service. Dormigo is a
                peer-to-peer marketplace exclusively for verified college students to buy and sell items within
                their campus community. If you do not agree to these terms, please do not use the platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Eligibility</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                You must be a currently enrolled student at an affiliated college or university to create an
                account. By registering, you confirm that you are a student and that the information you provide
                is accurate and complete.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">3. User Responsibilities</h2>
              <ul className="text-sm text-gray-600 leading-relaxed space-y-2 list-none">
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-1">•</span>
                  You are responsible for the accuracy of your listings, including condition descriptions and prices.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-1">•</span>
                  Transactions are conducted between buyers and sellers directly. Dormigo does not guarantee the
                  quality, safety, or legality of items listed.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-1">•</span>
                  You agree to meet in safe, public locations on campus when completing transactions.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-gray-400 mt-1">•</span>
                  You may not list prohibited items including weapons, illegal substances, counterfeit goods, or
                  items that violate intellectual property rights.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">4. OTP Verification</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Dormigo uses a one-time password (OTP) system to confirm that in-person exchanges have been
                completed. Both parties must be present to verify the transaction. Do not share your OTP with
                anyone before physically receiving the item.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Platform Fees</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Dormigo currently offers its platform free of charge. We reserve the right to introduce fees
                in the future with advance notice to users.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Account Termination</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                We reserve the right to suspend or terminate accounts that violate these terms, engage in
                fraudulent activity, or misuse the platform in any way.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Disclaimer</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                Dormigo is provided &ldquo;as is&rdquo; without warranties of any kind. We are not liable for any
                losses arising from transactions conducted through the platform. Use the platform at your own risk.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Changes to Terms</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                We may update these terms periodically. Continued use of Dormigo after changes constitutes
                acceptance of the new terms. We will notify users of significant changes via email.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Contact</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                For questions about these terms, contact us at{' '}
                <span className="font-medium text-gray-900">dormigoservice@gmail.com</span>.
              </p>
            </section>
          </div>
        </div>
      </Wrapper>
    </div>
  );
}
