import React from 'react';

const products = [
  {
    id: 'cocopeat',
    name: 'Cocopeat',
    description: 'Nutrient‑rich growing medium.',
    details: '5kg',
    price: '₦7,000',
    available: true,
    image: 'https://placehold.co/300x180?text=Cocopeat'
  },
  {
    id: 'fiber',
    name: 'Fiber',
    description: 'Biodegradable material for crafts and packaging.',
    details: 'A Full Sack',
    price: '₦15,000',
    available: true,
    image: 'https://placehold.co/300x180?text=Fiber'
  },
  {
    id: 'cocopot',
    name: 'Cocopot',
    description: 'Eco‑friendly plant containers.',
    details: '',
    price: 'Soon',
    available: false,
    image: 'https://placehold.co/300x180?text=Cocopot'
  },
  {
    id: 'briquette',
    name: 'Briquette charcoal',
    description: '',
    details: '',
    price: 'Soon',
    available: false,
    image: 'https://placehold.co/300x180?text=Briquette'
  },
  {
    id: 'biochar',
    name: 'Biochar',
    description: '',
    details: '',
    price: 'Soon',
    available: false,
    image: 'https://placehold.co/300x180?text=Biochar'
  }
];

function ProductCard({ product }: { product: typeof products[0] }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center text-center border border-gray-100 min-h-[400px]">
      <div className="w-full aspect-w-16 aspect-h-9 mb-4">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-40 object-cover rounded-lg"
        />
      </div>
      <h3 className="text-xl font-bold mb-2 text-gray-900">{product.name}</h3>
      <p className="text-gray-600 mb-2 min-h-[24px]">{product.description}</p>
      <p className="text-gray-500 mb-2 text-sm min-h-[20px]">{product.details || '\u00A0'}</p>
      <div className="mt-auto w-full">
        <button
          className={`mt-4 px-6 py-2 rounded-lg font-semibold w-full ${
            product.available
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!product.available}
        >
          {product.price}
        </button>
      </div>
    </div>
  );
}

export function ProductsList() {
  return (
    <section id="products" className="py-20">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Our Product
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
