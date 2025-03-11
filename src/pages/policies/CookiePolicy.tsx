import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '/src/components/Navbar';
import Footer from '/src/components/Footer';

export default function CookiePolicy() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <div className="flex-grow bg-gray-50 py-12">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
            <h1 className="text-3xl font-bold mb-6 text-center">Cookie Policy</h1>
            
            <div className="prose prose-green max-w-none">
              <p className="text-gray-600 mb-6 text-center">Last updated: {new Date().toLocaleDateString()}</p>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">1. What Are Cookies</h2>
                <p>Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Remembering your preferences</li>
                  <li>Understanding how you use our site</li>
                  <li>Improving site functionality</li>
                </ul>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">2. Types of Cookies We Use</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Essential Cookies</h3>
                    <p>Required for basic site functionality and security.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Performance Cookies</h3>
                    <p>Help us understand how visitors interact with our website.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Functionality Cookies</h3>
                    <p>Remember your preferences and settings.</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Marketing Cookies</h3>
                    <p>Used to deliver relevant advertisements and track their effectiveness.</p>
                  </div>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="text-xl font-semibold mb-4">3. Managing Cookies</h2>
                <p>You can control and manage cookies in various ways:</p>
                <ul className="list-disc pl-6 mb-4">
                  <li>Browser settings to block or delete cookies</li>
                  <li>Our cookie consent tool</li>
                  <li>Third-party opt-out tools</li>
                </ul>
              </section>
            </div>

            <div className="mt-8 pt-6 border-t text-center">
              <Link to="/" className="text-green-600 hover:text-green-700 font-medium">
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
