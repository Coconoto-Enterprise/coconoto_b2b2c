import React from 'react';
import { TrendingUp } from 'lucide-react';

const priceData = [
  {
    product: 'Raw Coconuts',
    prices: [
      { price: 1.50, currency: 'USD', unit: 'kg', countries: ['Philippines', 'Indonesia'] },
      { price: 1.75, currency: 'USD', unit: 'kg', countries: ['India', 'Sri Lanka'] },
      { price: 2.00, currency: 'USD', unit: 'kg', countries: ['Thailand', 'Malaysia'] }
    ]
  },
  {
    product: 'Activated Coconut Shell Charcoal',
    prices: [
      { price: 1000, currency: 'USD', unit: 'ton', countries: ['Nigeria', 'Ghana'] },
      { price: 1200, currency: 'USD', unit: 'ton', countries: ['Tanzania', 'Kenya'] },
      { price: 950, currency: 'USD', unit: 'ton', countries: ['South Africa', 'Mozambique'] }
    ]
  },
  {
    product: 'Cocopeat',
    prices: [
      { price: 250, currency: 'USD', unit: 'ton', countries: ['Sri Lanka', 'India'] },
      { price: 280, currency: 'USD', unit: 'ton', countries: ['Philippines', 'Vietnam'] },
      { price: 300, currency: 'USD', unit: 'ton', countries: ['Thailand', 'Malaysia'] }
    ]
  },
  {
    product: 'Coconut Shell Powder',
    prices: [
      { price: 400, currency: 'USD', unit: 'ton', countries: ['Indonesia', 'Malaysia'] },
      { price: 450, currency: 'USD', unit: 'ton', countries: ['India', 'Sri Lanka'] },
      { price: 480, currency: 'USD', unit: 'ton', countries: ['Philippines', 'Vietnam'] }
    ]
  },
  {
    product: 'Virgin Coconut Oil',
    prices: [
      { price: 4.50, currency: 'USD', unit: 'liter', countries: ['Philippines', 'Indonesia'] },
      { price: 5.00, currency: 'USD', unit: 'liter', countries: ['India', 'Sri Lanka'] },
      { price: 5.50, currency: 'USD', unit: 'liter', countries: ['Thailand', 'Vietnam'] }
    ]
  },
  {
    product: 'Desiccated Coconut',
    prices: [
      { price: 2.80, currency: 'USD', unit: 'kg', countries: ['Sri Lanka', 'Philippines'] },
      { price: 3.00, currency: 'USD', unit: 'kg', countries: ['Indonesia', 'Malaysia'] },
      { price: 3.20, currency: 'USD', unit: 'kg', countries: ['India', 'Thailand'] }
    ]
  },
  {
    product: 'Coconut Fiber (Coir)',
    prices: [
      { price: 350, currency: 'USD', unit: 'ton', countries: ['India', 'Sri Lanka'] },
      { price: 380, currency: 'USD', unit: 'ton', countries: ['Thailand', 'Vietnam'] },
      { price: 400, currency: 'USD', unit: 'ton', countries: ['Indonesia', 'Malaysia'] }
    ]
  },
  {
    product: 'Coconut Sugar',
    prices: [
      { price: 3.50, currency: 'USD', unit: 'kg', countries: ['Indonesia', 'Philippines'] },
      { price: 3.80, currency: 'USD', unit: 'kg', countries: ['Thailand', 'Malaysia'] },
      { price: 4.00, currency: 'USD', unit: 'kg', countries: ['Vietnam', 'Cambodia'] }
    ]
  }
];

export function PriceExchange() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="flex items-center gap-2 mb-8">
          <TrendingUp className="h-8 w-8 text-green-700" />
          <h2 className="text-3xl font-bold text-gray-900">Global Price Exchange</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Market Prices
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {priceData.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {item.product}
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      {item.prices.map((price, priceIndex) => (
                        <div key={priceIndex} className="flex items-center space-x-2 text-sm">
                          <span className="font-medium text-gray-900">
                            {price.price} {price.currency}/{price.unit}
                          </span>
                          <span className="text-gray-500">in</span>
                          <span className="text-gray-900">
                            {price.countries.join(', ')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          * Prices are indicative and subject to market fluctuations. Last updated: {new Date().toLocaleDateString()}
        </div>
      </div>
    </section>
  );
}