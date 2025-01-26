import React from 'react';

export function Process() {
  const steps = [
    {
      number: '01',
      title: 'Create Account',
      description: 'Sign up and complete your business profile'
    },
    {
      number: '02',
      title: 'Get Verified',
      description: 'Complete our verification process for trust and security'
    },
    {
      number: '03',
      title: 'Connect',
      description: 'Find and connect with potential business partners'
    },
    {
      number: '04',
      title: 'Trade',
      description: 'Start trading and growing your business'
    }
  ];

  return (
    <section id="how-it-works" className="py-20 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-12">
          How It Works
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-white p-6 rounded-lg shadow-lg">
                <span className="text-4xl font-bold text-green-700">{step.number}</span>
                <h3 className="text-xl font-semibold mt-4 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}