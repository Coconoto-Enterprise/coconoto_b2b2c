import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, CheckCircle, Clock, DollarSign, Lock, UserCheck, TrendingUp } from 'lucide-react';

export function EscrowService() {
  const steps = [
    {
      icon: <DollarSign className="h-8 w-8 text-green-600" />,
      title: "Secure Payment",
      description: "Buyer deposits payment into Coconoto's secure escrow account",
      image: "https://images.unsplash.com/photo-1580048915913-4f8f5cb481c4?w=800"
    },
    {
      icon: <Clock className="h-8 w-8 text-green-600" />,
      title: "Verification Period",
      description: "Supplier ships products with tracking information",
      image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800"
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-green-600" />,
      title: "Safe Release",
      description: "Funds released to supplier after buyer confirms delivery",
      image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800"
    }
  ];

  const benefits = [
    {
      icon: <Lock className="h-6 w-6 text-green-600" />,
      title: "100% Secure Payments",
      stat: "256-bit",
      description: "Bank-level encryption for all transactions"
    },
    {
      icon: <UserCheck className="h-6 w-6 text-green-600" />,
      title: "Verified Users",
      stat: "10,000+",
      description: "Active verified traders in our network"
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-green-600" />,
      title: "Transaction Volume",
      stat: "$50M+",
      description: "Successfully processed through escrow"
    }
  ];

  return (
    <section id="escrow-service" className="py-20 bg-gradient-to-br from-white to-green-50">
      <div className="container mx-auto px-6">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row items-center gap-12 mb-20">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="h-12 w-12 text-green-700" />
              <h2 className="text-4xl font-bold text-gray-900">Secure Escrow Service</h2>
            </div>
            <p className="text-xl text-gray-600 mb-8">
              Trade with complete confidence. Our escrow service ensures your transactions 
              are protected from start to finish, eliminating risks for both buyers and sellers.
            </p>
            <div className="p-6 bg-green-50 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">Why Use Escrow?</h4>
              <ul className="space-y-2 text-green-700">
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" /> Secure payment protection
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" /> Verified trading partners
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" /> Dispute resolution support
                </li>
              </ul>
            </div>
          </div>
          <div className="flex-1">
            <img
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800"
              alt="Secure Trading"
              className="rounded-lg shadow-2xl w-full"
            />
          </div>
        </div>

        {/* Process Steps */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {steps.map((step, index) => (
            <div key={index} className="group">
              <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl">
                <div className="h-48 overflow-hidden">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100">
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                  </div>
                  <p className="text-gray-600">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Statistics */}
        <div className="bg-white rounded-2xl shadow-lg p-12 mb-20">
          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                  {benefit.icon}
                </div>
                <div className="text-3xl font-bold text-green-700 mb-2">{benefit.stat}</div>
                <h4 className="text-lg font-semibold mb-2">{benefit.title}</h4>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-green-700 to-green-600 rounded-2xl p-12 text-white text-center">
          <h3 className="text-3xl font-bold mb-6">Start Trading Securely Today</h3>
          <p className="text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied traders who use our escrow service for safe and secure transactions.
          </p>
          <Link 
            to="/escrow"
            className="bg-white text-green-700 px-12 py-4 rounded-full text-lg font-semibold hover:bg-green-50 transition"
          >
            Get Started with Escrow
          </Link>
        </div>
      </div>
    </section>
  );
}