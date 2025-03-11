/* import React, { useState } from 'react';
import { Filter, Search, Plus } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { CategoryFilter } from './CategoryFilter';
import { AddProductModal } from './AddProductModal';
import { MarketplaceBanner } from './MarketplaceBanner';
import { MarketplaceEscrow } from './MarketplaceEscrow';
import { products } from '../../data/products';
import { useAuth } from '../../context/AuthContext';

export function Marketplace() {
  const { isAuthenticated, user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      <MarketplaceBanner />
      
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Coconoto Marketplace</h1>
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {isAuthenticated && user?.accountType === 'seller' && (
              <button
                onClick={() => setIsAddProductModalOpen(true)}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                <Plus className="h-5 w-5" />
                <span>Add Product</span>
              </button>
            )}
            <button className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border hover:bg-gray-50">
              <Filter className="h-5 w-5" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-3">
            <CategoryFilter
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>
          
          <div className="col-span-12 md:col-span-9">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>

        <AddProductModal
          isOpen={isAddProductModalOpen}
          onClose={() => setIsAddProductModalOpen(false)}
        />
      </div>

      <MarketplaceEscrow />
    </div>
  );
} */

import React, { useState } from 'react';
import { Filter, Plus } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { CategoryFilter } from './CategoryFilter';
import { AddProductModal } from './AddProductModal';
import { MarketplaceNavbar } from './MarketplaceNavbar';
import { MarketplaceHero } from './MarketplaceHero';
import { MarketplaceEscrow } from './MarketplaceEscrow';
import { products } from '../../data/products';
import { useAuth } from '../../context/AuthContext';
import MarketplaceFooter from './MarketplaceFooter';
import { MarketplaceBanner } from './MarketplaceBanner';
import RFQ from './RFQ';
import FastSales from './FastSales';

export function Marketplace() {
  const { isAuthenticated, user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <MarketplaceNavbar />
      <MarketplaceHero />
      <MarketplaceBanner />
      
      <div className="container mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">All Products</h2>
          <div className="flex items-center space-x-4 w-full md:w-auto">
            {isAuthenticated && user?.accountType === 'seller' && (
              <button
                onClick={() => setIsAddProductModalOpen(true)}
                className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                <Plus className="h-5 w-5" />
                <span>Add Product</span>
              </button>
            )}
            <button className="flex items-center space-x-2 bg-white px-4 py-2 rounded-lg border hover:bg-gray-50">
              <Filter className="h-5 w-5" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-3">
            <CategoryFilter
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>
          
          <div className="col-span-12 md:col-span-9">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>

        <AddProductModal
          isOpen={isAddProductModalOpen}
          onClose={() => setIsAddProductModalOpen(false)}
        />
      </div>

      <RFQ />
      <MarketplaceEscrow />
      <FastSales />
      <MarketplaceFooter />
    </div>
  );
}