import React from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Shield, Globe, BarChart2, HelpCircle } from 'lucide-react';

export function EscrowPricing() {
  const plans = [
    {
      name: "Basic",
      price: "1.5%",
      description: "For simple transactions under $10,000",
      bestFor: "Individuals & small purchases",
      features: [
        "Up to $10,000 per transaction",
        "Standard security protocols",
        "Email support",
        "Basic dispute resolution",
        "5 business day processing"
      ],
      cta: "Start with Basic",
      popular: false,
      color: "text-blue-600",
      borderColor: "border-blue-200",
      bgColor: "bg-blue-50"
    },
    {
      name: "Professional",
      price: "1.2%",
      description: "For growing businesses and frequent transactions",
      bestFor: "Small businesses & freelancers",
      features: [
        "Up to $50,000 per transaction",
        "Enhanced security",
        "Priority support",
        "Advanced dispute resolution",
        "3 business day processing",
        "Basic reporting"
      ],
      cta: "Get Professional",
      popular: true,
      color: "text-green-600",
      borderColor: "border-green-200",
      bgColor: "bg-green-50"
    },
    {
      name: "Enterprise",
      price: "0.8%",
      description: "For high-volume and high-value transactions",
      bestFor: "Businesses & large transactions",
      features: [
        "Unlimited transaction amount",
        "Military-grade security",
        "24/7 dedicated support",
        "Premium dispute resolution",
        "Next business day processing",
        "Advanced analytics",
        "API access",
        "Custom contracts"
      ],
      cta: "Contact Sales",
      popular: false,
      color: "text-purple-600",
      borderColor: "border-purple-200",
      bgColor: "bg-purple-50"
    }
  ];

  const features = [
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Bank-Level Security",
      description: "All plans include AES-256 encryption"
    },
    {
      icon: <Globe className="w-5 h-5" />,
      title: "Global Transactions",
      description: "Support for 135+ currencies"
    },
    {
      icon: <BarChart2 className="w-5 h-5" />,
      title: "Real-Time Tracking",
      description: "Monitor all transactions in your dashboard"
    },
    {
      icon: <HelpCircle className="w-5 h-5" />,
      title: "Dispute Protection",
      description: "Neutral mediation included with all plans"
    }
  ];

  return (
    <section id="pricing" className="relative py-20 bg-white">
      <div className="absolute inset-0 overflow-hidden opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern bg-repeat bg-center"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Pay only when you use our service. No hidden fees, no surprises.
          </p>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              className={`relative rounded-xl shadow-sm overflow-hidden border-2 ${plan.popular ? 'border-green-300 shadow-lg' : plan.borderColor}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                  MOST POPULAR
                </div>
              )}
              
              <div className={`p-8 ${plan.bgColor} bg-opacity-30`}>
                <h3 className={`text-2xl font-bold mb-2 ${plan.color}`}>{plan.name}</h3>
                <p className="text-gray-600 mb-4">{plan.description}</p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-600"> of transaction amount</span>
                </div>
                
                <p className="text-sm text-gray-500 mb-6">Best for: {plan.bestFor}</p>
                
                <button className={`w-full py-3 px-6 rounded-lg font-semibold ${
                  plan.popular 
                    ? 'bg-green-600 text-white hover:bg-green-700' 
                    : 'bg-white text-gray-800 border border-gray-300 hover:bg-gray-50'
                } transition-colors`}>
                  {plan.cta}
                </button>
              </div>
              
              <div className="p-8 bg-white">
                <h4 className="font-semibold text-gray-900 mb-4">Includes:</h4>
                <ul className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Features comparison */}
        <motion.div
          className="bg-gray-50 rounded-2xl p-8 md:p-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              All Plans Include
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              These powerful features come standard with every package
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="p-6 bg-white rounded-lg border border-gray-100 hover:border-green-200 transition-colors"
                whileHover={{ y: -5 }}
              >
                <div className={`w-10 h-10 rounded-full ${index % 2 === 0 ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'} flex items-center justify-center mb-4`}>
                  {feature.icon}
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h4>
                <p className="text-gray-600 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Enterprise CTA */}
          <div className="mt-12 text-center">
            <h4 className="text-xl font-semibold text-gray-900 mb-3">
              Need custom pricing for high volume?
            </h4>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Our enterprise solutions offer volume discounts and custom features for businesses processing over $500,000 annually.
            </p>
            <button className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors inline-flex items-center">
              Contact Our Sales Team
              <Zap className="w-4 h-4 ml-2" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}