import React from 'react';
import { Wallet, Globe, CreditCard, ArrowLeftRight, Building2, DollarSign, ShieldCheck } from 'lucide-react';

export function CoconotoPay() {
  const features = [
    {
      icon: <Globe className="h-8 w-8 text-green-600" />,
      title: "Global Payments",
      description: "Send and receive payments worldwide with competitive exchange rates",
      image: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800"
    },
    {
      icon: <CreditCard className="h-8 w-8 text-green-600" />,
      title: "Multi-Currency Accounts",
      description: "Manage multiple currencies in one secure dashboard",
      image: "https://images.unsplash.com/photo-1601597111158-2fceff292cdc?w=800"
    },
    {
      icon: <ArrowLeftRight className="h-8 w-8 text-green-600" />,
      title: "Instant Transfers",
      description: "Lightning-fast domestic and international transfers",
      image: "https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?w=800"
    }
  ];

  const benefits = [
    {
      icon: <Building2 className="h-6 w-6 text-green-600" />,
      title: "Bank-Grade Security",
      description: "Your funds are protected with state-of-the-art encryption"
    },
    {
      icon: <DollarSign className="h-6 w-6 text-green-600" />,
      title: "Competitive Rates",
      description: "Save up to 80% on international transfer fees"
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-green-600" />,
      title: "Fully Regulated",
      description: "Licensed and regulated financial institution"
    }
  ];

  return (
    <section id="coconoto-pay" className="py-20 bg-gradient-to-br from-green-50 to-white">
      <div className="container mx-auto px-6">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-12 mb-20">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-6">
              <Wallet className="h-12 w-12 text-green-700" />
              <h2 className="text-4xl font-bold text-gray-900">CoconotoPay</h2>
            </div>
            <p className="text-xl text-gray-600 mb-8">
              Transform your coconut trade with our comprehensive financial platform. 
              Experience seamless payments, competitive rates, and bank-grade security.
            </p>
            <div className="flex gap-4">
              <button className="bg-green-700 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-800 transition">
                Get Started
              </button>
              <button className="border-2 border-green-700 text-green-700 px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-50 transition">
                Learn More
              </button>
            </div>
          </div>
          <div className="flex-1">
            <img
              src="https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800"
              alt="Digital Finance"
              className="rounded-lg shadow-2xl w-full"
            />
          </div>
        </div>

        {/* Rest of the component remains unchanged */}
        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <div key={index} className="group">
              <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
                <div className="h-48 overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    {feature.icon}
                    <h3 className="text-xl font-semibold">{feature.title}</h3>
                  </div>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="bg-white rounded-2xl shadow-lg p-12">
          <h3 className="text-2xl font-bold text-center mb-12">Why Choose CoconotoPay?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mb-4">
                  {benefit.icon}
                </div>
                <h4 className="text-lg font-semibold mb-2">{benefit.title}</h4>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-3xl font-bold mb-6">Ready to Transform Your Business?</h3>
            <p className="text-gray-600 mb-8">
              Join thousands of businesses already using CoconotoPay to streamline their financial operations.
            </p>
            <button className="bg-green-700 text-white px-12 py-4 rounded-full text-lg font-semibold hover:bg-green-800 transition">
              Start Your Journey Today
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}