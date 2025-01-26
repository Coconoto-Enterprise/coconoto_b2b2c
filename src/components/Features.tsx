import React from 'react';
import { Shield, Globe, Zap, Users } from 'lucide-react';

export function Features() {
  const features = [
    {
      icon: <Shield className="w-12 h-12 text-green-700" />,
      title: 'Verified Partners',
      description: 'All suppliers and buyers are thoroughly vetted for your security'
    },
    {
      icon: <Globe className="w-12 h-12 text-green-700" />,
      title: 'Global Reach',
      description: 'Access markets worldwide and expand your business internationally'
    },
    {
      icon: <Zap className="w-12 h-12 text-green-700" />,
      title: 'Quick Transactions',
      description: 'Streamlined process for faster and efficient deal closure'
    },
    {
      icon: <Users className="w-12 h-12 text-green-700" />,
      title: 'Community Driven',
      description: 'Join a thriving community of successful businesses'
    }
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
          Why Choose Coconoto?
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="p-6 text-center">
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}