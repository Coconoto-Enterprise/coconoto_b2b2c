import React from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  CreditCard, 
  Truck, 
  CheckCircle,
  ArrowRight,
  Shield,
  Clock,
  Zap,
  HelpCircle
} from 'lucide-react';

export function EscrowProcess() {
  const steps = [
    {
      icon: <FileText className="w-8 h-8" />,
      title: "1. Agreement Creation",
      description: "Both parties agree on terms and create a smart contract",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: <CreditCard className="w-8 h-8" />,
      title: "2. Secure Payment",
      description: "Buyer deposits funds into the escrow account",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      icon: <Truck className="w-8 h-8" />,
      title: "3. Delivery Verification",
      description: "Seller delivers goods/services as agreed",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: <CheckCircle className="w-8 h-8" />,
      title: "4. Approval & Release",
      description: "Buyer approves, funds are released to seller",
      color: "text-teal-600",
      bgColor: "bg-teal-50"
    }
  ];

  const benefits = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Fraud Protection",
      description: "Eliminates risk of non-payment or non-delivery"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Time Savings",
      description: "Automated process reduces administrative work"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Instant Notifications",
      description: "Real-time updates at every stage"
    },
    {
      icon: <HelpCircle className="w-6 h-6" />,
      title: "Dispute Resolution",
      description: "Neutral mediation services included"
    }
  ];

  return (
    <section id="process" className="relative py-20 bg-gray-50">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-dotted-pattern bg-repeat bg-center"></div>
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
            How Our Escrow Process Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A simple, secure four-step process that protects both buyers and sellers
          </p>
        </motion.div>

        {/* Process steps */}
        <div className="relative mb-20">
          {/* Timeline connector */}
          <div className="hidden md:block absolute left-1/2 top-0 h-full w-0.5 bg-gray-200 transform -translate-x-1/2"></div>
          <div className="hidden md:block absolute left-1/2 top-0 h-full w-0.5 bg-green-500 transform -translate-x-1/2 origin-top animate-grow-height"></div>

          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                className={`relative ${index % 2 === 0 ? 'md:mb-0' : 'md:mt-20'}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                viewport={{ once: true }}
              >
                {/* Step number indicator */}
                <div className="hidden md:flex absolute left-1/2 -ml-4 -top-4 w-8 h-8 rounded-full bg-green-500 text-white items-center justify-center font-bold z-10">
                  {index + 1}
                </div>

                <div className={`h-full p-8 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow ${step.bgColor} bg-opacity-20 border border-gray-100`}>
                  <div className={`${step.bgColor} ${step.color} w-12 h-12 rounded-full flex items-center justify-center mb-6 mx-auto`}>
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-center text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 text-center">
                    {step.description}
                  </p>
                </div>

                {/* Arrow connector for mobile */}
                {index < steps.length - 1 && (
                  <div className="md:hidden flex justify-center my-4">
                    <ArrowRight className="w-6 h-6 text-gray-400" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Benefits section */}
        <motion.div
          className="bg-white rounded-2xl shadow-sm p-8 md:p-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Why Use Escrow?
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Benefits for both buyers and sellers in every transaction
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className="p-6 rounded-lg border border-gray-100 hover:border-green-200 transition-colors"
                whileHover={{ y: -5 }}
              >
                <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center mb-4">
                  {benefit.icon}
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h4>
                <p className="text-gray-600 text-sm">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}