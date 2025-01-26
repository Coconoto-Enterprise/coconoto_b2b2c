import React from 'react';
import { Link } from 'react-router-dom';

export function TermsOfService() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
          
          <div className="prose prose-green max-w-none">
            <p className="text-gray-600 mb-6">Last updated: {new Date().toLocaleDateString()}</p>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p>By accessing and using Coconoto's services, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">2. User Responsibilities</h2>
              <ul className="list-disc pl-6 mb-4">
                <li>Maintain accurate account information</li>
                <li>Comply with all applicable laws</li>
                <li>Protect account credentials</li>
                <li>Use the platform responsibly</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">3. Service Rules</h2>
              <p>When using our platform, you agree not to:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Violate any laws or regulations</li>
                <li>Infringe on intellectual property rights</li>
                <li>Engage in fraudulent activities</li>
                <li>Disrupt or interfere with the service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">4. Intellectual Property</h2>
              <p>All content and materials available on Coconoto are protected by intellectual property rights. Users may not:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>Copy or reproduce platform content</li>
                <li>Modify or create derivative works</li>
                <li>Distribute or publicly display content</li>
              </ul>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t">
            <Link to="/" className="text-green-600 hover:text-green-700">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}