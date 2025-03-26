import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Globe, 
  Zap, 
  FileText,
  Clock,
  Mail,
  Bell,
  BarChart2,
  CreditCard
} from 'lucide-react';

export function EscrowFeatures() {
  const features = [
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: "Military-Grade Security",
      description: "Bank-level encryption and multi-factor authentication protect every transaction",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Transactions",
      description: "Support for 135+ currencies and seamless cross-border payments",
      color: "text-green-600",
      bgColor: "bg-green-50"
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Instant payment releases upon conditions being met",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50"
    },
    {
      icon: <FileText className="w-8 h-8" />,
      title: "Smart Contracts",
      description: "Automated, customizable agreements that execute precisely as written",
      color: "text-purple-600",
      bgColor: "bg-purple-50"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "24/7 Monitoring",
      description: "Round-the-clock transaction oversight and fraud detection",
      color: "text-red-600",
      bgColor: "bg-red-50"
    },
    {
      icon: <BarChart2 className="w-8 h-8" />,
      title: "Real-Time Reporting",
      description: "Comprehensive dashboards with transaction analytics",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50"
    }
  ];

  const workflow = [
    {
      step: 1,
      title: "Create Agreement",
      description: "Buyer and seller set terms",
      icon: <FileText className="w-6 h-6" />
    },
    {
      step: 2,
      title: "Fund Escrow",
      description: "Buyer deposits payment securely",
      icon: <CreditCard className="w-6 h-6" />
    },
    {
      step: 3,
      title: "Delivery & Approval",
      description: "Seller delivers goods/services",
      icon: <Mail className="w-6 h-6" />
    },
    {
      step: 4,
      title: "Payment Release",
      description: "Funds released to seller",
      icon: <Bell className="w-6 h-6" />
    }
  ];

  return (
    <section id="features" className="relative py-20 bg-white">
      {/* Section background pattern */}
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
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Trusted by businesses worldwide
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform combines cutting-edge technology with financial expertise to 
            protect your transactions at every step.
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="p-8 rounded-xl transition-all hover:-translate-y-2 hover:shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-100px" }}
            >
              <div className={`${feature.bgColor} ${feature.color} w-14 h-14 rounded-full flex items-center justify-center mb-6`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Workflow section */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-3xl p-8 md:p-12">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              How Escrow Works
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              A simple 4-step process protects both buyers and sellers
            </p>
          </motion.div>

          <div className="relative">
            {/* Progress line */}
            <div className="hidden md:block absolute top-8 left-0 right-0 h-1 bg-gray-200"></div>
            <div className="hidden md:block absolute top-8 left-0 h-1 bg-green-500 transition-all duration-1000" style={{ width: '100%' }}></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {workflow.map((step, index) => (
                <motion.div
                  key={index}
                  className="text-center relative z-10"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <div className="mx-auto mb-4 w-16 h-16 bg-white border-2 border-green-500 rounded-full flex items-center justify-center text-green-600 font-bold shadow-sm">
                    {step.icon}
                  </div>
                  <div className="md:absolute md:top-24 left-0 right-0 px-2">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h4>
                    <p className="text-gray-600 text-sm">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}