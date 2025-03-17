import React from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Users, Info, ShieldCheck, Mail } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export default function MarketplaceFooter() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Branding Section */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <ShoppingBag className="h-8 w-8 text-green-500" />
              <span className="text-2xl font-bold">Coconoto Marketplace</span>
            </div>
            <p className="text-gray-400">
              Your trusted B2B marketplace for seamless transactions.
            </p>
          </div>

          {/* Marketplace Navigation */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Marketplace</h3>
            <ul className="space-y-2">
              <li><Link to="/marketplace" className="text-gray-400 hover:text-white">Products</Link></li>
              <li><Link to="/marketplace/rfq" className="text-gray-400 hover:text-white">RFQ</Link></li>
              <li><Link to="/marketplace/suppliers" className="text-gray-400 hover:text-white">Suppliers</Link></li>
            </ul>
          </div>

          {/* Resources Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/help-center" className="text-gray-400 hover:text-white">Help Center</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              <li><Link to="/blog" className="text-gray-400 hover:text-white">Blog</Link></li>
            </ul>
          </div>

          {/* Legal Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy-policy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
              <li><Link to="/cookie-policy" className="text-gray-400 hover:text-white">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-8 text-center">
          <a
            href="https://wa.me/+2348148609051"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-green-400 hover:text-green-500"
          >
            <FaWhatsapp className="h-6 w-6" />
            <span>Chat with us on WhatsApp</span>
          </a>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} Coconoto Marketplace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
