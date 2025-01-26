import React from 'react';
import { Link } from 'react-router-dom';
import { Palmtree, Mail, Phone, MapPin } from 'lucide-react';

export function ServicesFooter() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Palmtree className="h-8 w-8 text-green-500" />
              <span className="text-2xl font-bold">Coconoto Services</span>
            </div>
            <p className="text-gray-400">
              Complete industrial solutions for coconut processing and manufacturing.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Our Solutions</h3>
            <ul className="space-y-2">
              <li><a href="#machines" className="text-gray-400 hover:text-white">Processing Machines</a></li>
              <li><a href="#building" className="text-gray-400 hover:text-white">Factory Construction</a></li>
              <li><a href="#production" className="text-gray-400 hover:text-white">Production Management</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-white">Technical Support</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Certifications</h3>
            <ul className="space-y-2">
              <li><a href="#certificates" className="text-gray-400 hover:text-white">Patents</a></li>
              <li><a href="#certificates" className="text-gray-400 hover:text-white">ISO Certifications</a></li>
              <li><a href="#certificates" className="text-gray-400 hover:text-white">Manufacturing Licenses</a></li>
              <li><a href="#certificates" className="text-gray-400 hover:text-white">Quality Standards</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li className="flex items-center text-gray-400">
                <Mail className="h-5 w-5 mr-2" />
                services@coconoto.com
              </li>
              <li className="flex items-center text-gray-400">
                <Phone className="h-5 w-5 mr-2" />
                +1 234 567 8900
              </li>
              <li className="flex items-center text-gray-400">
                <MapPin className="h-5 w-5 mr-2" />
                Global Locations
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              © {new Date().getFullYear()} Coconoto Industrial Services. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link to="/" className="text-gray-400 hover:text-white text-sm">Home</Link>
              <Link to="/about" className="text-gray-400 hover:text-white text-sm">About</Link>
              <Link to="/marketplace" className="text-gray-400 hover:text-white text-sm">Marketplace</Link>
              <a href="#contact" className="text-gray-400 hover:text-white text-sm">Contact</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}