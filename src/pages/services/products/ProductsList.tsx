import React, { useState } from 'react';
import { ProductCartProvider, useProductCart } from '../../../components/ProductCartContext';
import { FloatingCartButton } from '../../../components/FloatingCartButton';
import { ProductCheckoutModal } from '../../../components/ProductCheckoutModal';
import cocopeat from '../../../assets/cocpeat1.jpeg';
import cocofiber from '../../../assets/fiber.jpeg';
import cocopot from '../../../assets/cocopot2.jpg';
import briquette from '../../../assets/Briquette.jpeg';
import biochar from '../../../assets/biochar.jpeg';


const products = [
  {
    id: 'cocopeat',
    name: 'Cocopeat',
    description: 'Nutrient‑rich growing medium.',
    details: '5kg',
    price: '₦7,000',
    available: true,
    image: cocopeat
  },
  {
    id: 'fiber',
    name: 'Fiber',
    description: 'Biodegradable material for crafts and packaging.',
    details: 'A Full Sack',
    price: '₦15,000',
    available: true,
    image: cocofiber
  },
  {
    id: 'cocopot',
    name: 'Cocopot',
    description: 'Eco‑friendly plant containers.',
    details: '',
    price: 'Soon',
    available: false,
    image: cocopot
  },
  {
    id: 'briquette',
    name: 'Briquette charcoal',
    description: '',
    details: '',
    price: 'Soon',
    available: false,
    image: briquette
  },
  {
    id: 'biochar',
    name: 'Biochar',
    description: '',
    details: '',
    price: 'Soon',
    available: false,
    image: biochar
  }
];

function ProductCard({ product }: { product: typeof products[0] }) {
  const { addToCart } = useProductCart();
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
          className={`mt-4 px-6 py-2 rounded-lg font-semibold w-full flex items-center justify-center gap-2 ${
            product.available
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!product.available}
          onClick={() => product.available && addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image
          })}
        >
          {product.price}
        </button>
      </div>
    </div>
  );
}

export function ProductsList() {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  return (
    <ProductCartProvider>
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
        <FloatingCartButton onClick={() => setCheckoutOpen(true)} />
        <ProductCheckoutModal isOpen={checkoutOpen} onClose={() => setCheckoutOpen(false)} />
      </section>
    </ProductCartProvider>
  );
}
