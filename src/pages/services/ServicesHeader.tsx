import React from 'react';
import { Link } from 'react-router-dom';
import { Palmtree } from 'lucide-react';

export function ServicesHeader() {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Palmtree className="h-8 w-8 text-green-700" />
            <span className="text-2xl font-bold text-green-900">Coconoto Services</span>
          </Link>
          
          <nav className="hidden md:flex space-x-8">
            <a href="#machines" className="text-gray-600 hover:text-green-700">Machines</a>
            <a href="#building" className="text-gray-600 hover:text-green-700">Building</a>
            <a href="#production" className="text-gray-600 hover:text-green-700">Production</a>
            <a href="#contact" className="text-gray-600 hover:text-green-700">Contact</a>
          </nav>
        </div>
      </div>
    </header>
  );
}