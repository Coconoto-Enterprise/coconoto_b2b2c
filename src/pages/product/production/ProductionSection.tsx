import React from 'react';
import { Settings, TrendingUp, Users, Shield } from 'lucide-react';

export function ProductionSection() {
  const features = [
    {
      icon: <Settings className="h-8 w-8 text-green-600" />,
      title: "Process Optimization",
      description: "Streamline your production with our expert consultation"
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-green-600" />,
      title: "Efficiency Improvement",
      description: "Increase output while reducing operational costs"
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      title: "Staff Training",
      description: "Comprehensive training for your production team"
    },
    {
      icon: <Shield className="h-8 w-8 text-green-600" />,
      title: "Quality Assurance",
      description: "Implement robust quality control systems"
    }
  ];

  return (
    <section id="production" className="py-5">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Production Management
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-center mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-center mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-center">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}