import React from 'react';
import { TrendingUp, Users, DollarSign, Globe } from 'lucide-react';

export function InvestmentSection() {
  const metrics = [
    {
      icon: <TrendingUp className="h-8 w-8 text-green-600" />,
      value: "127%",
      label: "Annual Growth",
      description: "Year-over-year revenue growth"
    },
    {
      icon: <Users className="h-8 w-8 text-green-600" />,
      value: "10,000+",
      label: "Active Users",
      description: "Verified businesses on our platform"
    },
    {
      icon: <DollarSign className="h-8 w-8 text-green-600" />,
      value: "$50M+",
      label: "Transaction Volume",
      description: "Monthly trading volume"
    },
    {
      icon: <Globe className="h-8 w-8 text-green-600" />,
      value: "45+",
      label: "Countries",
      description: "Global market presence"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-green-50 to-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Invest in Coconoto
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Join us in revolutionizing the coconut industry through technology and innovation
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 mb-16">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex justify-center mb-4">{metric.icon}</div>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">{metric.value}</div>
                <div className="text-lg font-semibold text-gray-700 mb-2">{metric.label}</div>
                <p className="text-gray-600">{metric.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold text-center mb-6">Become an Investor</h3>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Name</label>
                  <input
                    type="text"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    type="email"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Investment Range</label>
                <select
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  required
                >
                  <option value="">Select range</option>
                  <option value="50k-100k">$50,000 - $100,000</option>
                  <option value="100k-500k">$100,000 - $500,000</option>
                  <option value="500k-1m">$500,000 - $1,000,000</option>
                  <option value="1m+">$1,000,000+</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Message</label>
                <textarea
                  rows={4}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  placeholder="Tell us about your investment interests and experience..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition"
              >
                Submit Interest
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}