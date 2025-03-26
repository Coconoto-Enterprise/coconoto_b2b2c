import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Zap, CheckCircle } from 'lucide-react';

export default function EscrowCTA() {
  const benefits = [
    {
      icon: <Shield className="w-6 h-6" />,
      text: "No payment risks"
    },
    {
      icon: <Zap className="w-6 h-6" />,
      text: "Instant setup"
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      text: "Satisfaction guaranteed"
    }
  ];

  return (
    <section id="cta" className="relative py-20 bg-gradient-to-r from-green-700 to-green-600 overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-20 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 right-20 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-10"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Animated headline */}
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Ready to Trade with Confidence?
          </motion.h2>

          {/* Animated subtitle */}
          <motion.p
            className="text-xl text-green-100 max-w-3xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Join thousands of businesses and individuals who secure their transactions with our trusted escrow service.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            className="flex flex-col sm:flex-row justify-center gap-4 mb-14"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <a
              href="/signup"
              className="px-8 py-4 bg-white text-green-700 font-semibold rounded-lg shadow-lg hover:bg-gray-100 hover:shadow-xl transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <span>Get Started - It's Free</span>
              <ArrowRight className="h-5 w-5" />
            </a>
            <a
              href="/demo"
              className="px-8 py-4 border-2 border-white text-white font-semibold rounded-lg hover:bg-green-500 hover:bg-opacity-20 transition-all duration-300"
            >
              Request a Demo
            </a>
          </motion.div>

          {/* Benefits list */}
          <motion.div
            className="flex flex-wrap justify-center gap-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
          >
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center space-x-2 text-green-50">
                <div className="bg-green-500 bg-opacity-30 p-1.5 rounded-full">
                  {benefit.icon}
                </div>
                <span>{benefit.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Floating elements */}
      <motion.div
        className="absolute bottom-10 left-10 w-16 h-16 bg-white bg-opacity-10 rounded-full"
        animate={{
          y: [0, -20, 0],
          opacity: [0.8, 1, 0.8]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="absolute top-20 right-20 w-10 h-10 bg-white bg-opacity-10 rounded-full"
        animate={{
          y: [0, -15, 0],
          opacity: [0.6, 0.9, 0.6]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
      />
      <motion.div
        className="absolute bottom-1/3 right-1/4 w-8 h-8 bg-white bg-opacity-10 rounded-full"
        animate={{
          y: [0, -10, 0],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
    </section>
  );
}