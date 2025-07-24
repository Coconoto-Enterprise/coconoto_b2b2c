import React from 'react';
import { Link } from 'react-router-dom';
import { Palmtree } from 'lucide-react';
import { FaFacebook, FaInstagram, FaLinkedin, FaWhatsapp, FaEnvelope } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img src="/Icon_green.png" alt="o" className="h-8 inline-block mx-[-6px] mt-[6px] ms-[1.5px] mr-[1.5px]" />
              <span className="text-4xl font-bold">Coconoto</span>
            </div>
            <p className="text-gray-400 mb-4">
              Transforming B2B trade through innovation and trust.
            </p>
            <div className="flex space-x-4 flex-wrap">
              <a href="https://m.facebook.com/p/Coconoto-100092422418297/" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-gray-600 transition-colors" aria-label="Facebook">
                <FaFacebook className="h-6 w-6" />
              </a>
              <a href="https://www.instagram.com/_coconoto?igsh=MTNuZXh1dGF1dTd0dw==" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-gray-600 transition-colors" aria-label="Instagram">
                <FaInstagram className="h-6 w-6" />
              </a>
              <a href="https://www.linkedin.com/company/coconoto/" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-gray-600 transition-colors" aria-label="LinkedIn">
                <FaLinkedin className="h-6 w-6" />
              </a>
              <a href="https://wa.me/qr/CTOTUF7JCEUFE1" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-gray-600 transition-colors" aria-label="WhatsApp">
                <FaWhatsapp className="h-6 w-6" />
              </a>
              <a href="mailto:coconotoenterprise@gmail.com" className="text-green-600 hover:text-gray-600 transition-colors" aria-label="Email">
                <FaEnvelope className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Home</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy-policy" className="text-gray-400 hover:text-white">Privacy Policy</Link></li>
              <li><Link to="/terms-of-service" className="text-gray-400 hover:text-white">Terms of Service</Link></li>
              <li><Link to="/cookie-policy" className="text-gray-400 hover:text-white">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>© {new Date().getFullYear()} Coconoto. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}