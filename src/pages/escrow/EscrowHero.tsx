import React from 'react';
import { Shield, Lock, DollarSign, ArrowRight, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export function EscrowHero() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: "Secure Payments",
      description: "Funds held safely until delivery confirmation"
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: "Verified Users",
      description: "Trusted network of authenticated partners"
    },
    {
      icon: <DollarSign className="h-6 w-6" />,
      title: "Low Fees",
      description: "Competitive rates with transparent pricing"
    }
  ];

  const stats = [
    { value: "10,000+", label: "Completed Transactions" },
    { value: "$250M+", label: "In Protected Payments" },
    { value: "98.7%", label: "Satisfaction Rate" }
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-white to-green-50">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-20 w-64 h-64 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-70"></div>
        <div className="absolute bottom-0 right-20 w-64 h-64 bg-green-500 rounded-full mix-blend-multiply filter blur-3xl opacity-40"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="text-center">
          {/* Animated headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-800">
                Secure Escrow
              </span>{' '}
              <br className="md:hidden" />
              for Peace of Mind
            </h1>
          </motion.div>

          {/* Animated subtitle */}
          <motion.p
            className="mt-6 text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Protect your transactions with our trusted escrow service. Safe, simple, and 
            reliable payment protection for buyers and sellers worldwide.
          </motion.p>

          {/* Animated CTA buttons */}
          <motion.div
            className="mt-10 flex flex-col sm:flex-row justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <button
              onClick={() => navigate('/create-transaction')}
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl hover:from-green-700 hover:to-green-800 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <span>Start New Transaction</span>
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 border-2 border-green-600 text-green-700 font-semibold rounded-lg hover:bg-green-50 transition-all duration-300"
            >
              How It Works
            </button>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            className="mt-16 flex flex-wrap justify-center gap-6 items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center px-4 py-2 bg-white rounded-lg shadow-sm">
                <p className="text-2xl font-bold text-green-700">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Features grid */}
        <motion.div
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full text-green-600 mb-4 mx-auto">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-center mb-3 text-gray-900">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-center">{feature.description}</p>
              <div className="mt-4 flex justify-center">
                <Check className="h-5 w-5 text-green-500" />
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}