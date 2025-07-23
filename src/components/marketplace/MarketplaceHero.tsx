import React from 'react';
import { TrendingUp, Shield, Globe } from 'lucide-react';

export function MarketplaceHero() {
  const features = [
    {
      icon: <TrendingUp className="h-12 w-12 text-green-600" />,
      title: "Live Market Prices",
      description: "Real-time pricing updates from global coconut markets"
    },
    {
      icon: <Shield className="h-12 w-12 text-green-600" />,
      title: "Verified Sellers",
      description: "All suppliers are thoroughly vetted for quality assurance"
    },
    {
      icon: <Globe className="h-12 w-12 text-green-600" />,
      title: "Global Trade",
      description: "Connect with suppliers and buyers worldwide"
    }
  ];

  const featuredProducts = [
    {
      name: "Fresh Coconuts",
      image: "https://images.unsplash.com/photo-1551489186-cf8726f514f8?w=800",
      price: "$1.50/unit"
    },
    {
      name: "Virgin Coconut Oil",
      image: "https://images.unsplash.com/photo-1620905969432-d7a31d1b4598?w=800",
      price: "$12.99/liter"
    },
    {
      name: "Coir Products",
      image: "https://images.unsplash.com/photo-1585560595756-c85530798b13?w=800",
      price: "$2.99/kg"
    }
  ];

  return (
    <div className="bg-gradient-to-b from-green-50 to-white py-16">
      <div className="container mx-auto px-6">
        {/* Hero Content */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Global Coconut Trading Platform
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Connect with verified suppliers and buyers worldwide. Get the best prices
            for coconut products with our secure trading platform.
          </p>
          <div className="flex justify-center gap-4">
            <button className="bg-green-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-700 transition">
              Start Trading
            </button>
            <button className="border-2 border-green-600 text-green-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-50 transition">
              View Products
            </button>
          </div>
        </div>

        {/* Featured Products */}
        {/* <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Featured Products</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredProducts.map((product, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden group">
                <div className="h-48 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-green-600 font-medium">{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div> */}

        {/* Features */}
        <div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}