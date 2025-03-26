import React from "react";
import { Link } from "react-router-dom";
import { Shield, FileText, HelpCircle, Mail, Lock, Globe, ArrowRight } from "lucide-react";
import { FaWhatsapp, FaLinkedin, FaTwitter } from "react-icons/fa";

export default function EscrowFooter() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Branding Section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-5">
              <Shield className="h-8 w-8 text-green-500" />
              <span className="text-2xl font-bold">Coconoto Escrow</span>
            </div>
            <p className="text-gray-400 mb-6">
              Secure payment protection for buyers and sellers worldwide. 
              Trusted by thousands for safe and reliable transactions.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaLinkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <FaTwitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Services Section */}
          <div>
            <h3 className="text-lg font-semibold mb-5 flex items-center">
              <Lock className="h-5 w-5 mr-2 text-green-500" />
              Services
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/escrow/how-it-works" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2 text-green-500" />
                  How Escrow Works
                </Link>
              </li>
              <li>
                <Link to="/escrow/pricing" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2 text-green-500" />
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/escrow/integrations" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2 text-green-500" />
                  Integrations
                </Link>
              </li>
              <li>
                <Link to="/escrow/case-studies" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2 text-green-500" />
                  Case Studies
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Section */}
          <div>
            <h3 className="text-lg font-semibold mb-5 flex items-center">
              <HelpCircle className="h-5 w-5 mr-2 text-green-500" />
              Resources
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/help-center" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2 text-green-500" />
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2 text-green-500" />
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2 text-green-500" />
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/api-docs" className="text-gray-400 hover:text-white transition-colors flex items-center">
                  <ArrowRight className="h-4 w-4 mr-2 text-green-500" />
                  API Documentation
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-5 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-green-500" />
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/security" className="text-gray-400 hover:text-white transition-colors">
                  Security
                </Link>
              </li>
              <li>
                <Link to="/compliance" className="text-gray-400 hover:text-white transition-colors">
                  Compliance
                </Link>
              </li>
            </ul>

            <h3 className="text-lg font-semibold mt-8 mb-5 flex items-center">
              <Mail className="h-5 w-5 mr-2 text-green-500" />
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="text-gray-400">support@coconotoescrow.com</li>
              <li className="text-gray-400">+1 (800) 123-4567</li>
              <li>
                <a 
                  href="https://wa.me/1234567890" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-400 hover:text-green-300 transition-colors flex items-center"
                >
                  <FaWhatsapp className="h-5 w-5 mr-2" />
                  WhatsApp Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 flex flex-wrap justify-center gap-6 items-center">
          <div className="flex items-center space-x-2">
            <Globe className="h-6 w-6 text-green-500" />
            <span className="text-gray-300">Global Transactions</span>
          </div>
          <div className="h-6 w-px bg-gray-700"></div>
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-green-500" />
            <span className="text-gray-300">256-bit Encryption</span>
          </div>
          <div className="h-6 w-px bg-gray-700"></div>
          <div className="flex items-center space-x-2">
            <Lock className="h-6 w-6 text-green-500" />
            <span className="text-gray-300">PCI DSS Compliant</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500">
          <p>© {new Date().getFullYear()} Coconoto Escrow Services. All rights reserved.</p>
          <p className="mt-2 text-sm">Coconoto Escrow is a financial service provider registered in all 50 states.</p>
        </div>
      </div>
    </footer>
  );
}