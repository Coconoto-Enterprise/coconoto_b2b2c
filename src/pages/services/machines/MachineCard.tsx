import React, { useState } from 'react';
import { Machine } from './types';
import { OrderDeshellerModal } from './OrderDeshellerModal';
import { OrderDehuskerModal } from './OrderDehuskerModal';
import { OrderCocopeatModal } from './OrderCocopeatModal';

interface MachineCardProps {
  machine: Machine;
}

export function MachineCard({ machine }: MachineCardProps) {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105 mx-auto w-full md:max-w-xs flex flex-col">
        <div className="aspect-w-16 aspect-h-9">
          <img
            src={machine.image}
            alt={machine.name}
            className="w-full h-48 object-cover"
          />
        </div>
        <div className="p-6 flex flex-col flex-1">
          <h3 className="text-xl font-semibold mb-2">{machine.name}</h3>
          <p className="text-gray-600 mb-4">{machine.description}</p>
          <div className="space-y-2">
            {machine.features.map((feature, index) => (
              <div key={index} className="flex items-center text-sm text-gray-600">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                {feature}
              </div>
            ))}
          </div>
          <div className="mt-auto pt-4">
            <button 
              onClick={() => setIsOrderModalOpen(true)}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
            >
              {machine.id === 'dehusker' ? 'Partner with us' : 'Order Now'}
            </button>
          </div>
        </div>
      </div>

      {machine.id === 'desheller' && (
        <OrderDeshellerModal
          isOpen={isOrderModalOpen}
          onClose={() => setIsOrderModalOpen(false)}
        />
      )}
      {machine.id === 'dehusker' && (
        <OrderDehuskerModal
          isOpen={isOrderModalOpen}
          onClose={() => setIsOrderModalOpen(false)}
        />
      )}
      {machine.id === 'cocopeat' && (
        <OrderCocopeatModal
          isOpen={isOrderModalOpen}
          onClose={() => setIsOrderModalOpen(false)}
        />
      )}
    </>
  );
}