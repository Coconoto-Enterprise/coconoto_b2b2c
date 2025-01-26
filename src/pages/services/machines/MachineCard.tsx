import React, { useState } from 'react';
import { Machine } from './types';
import { OrderMachineModal } from './OrderMachineModal';

interface MachineCardProps {
  machine: Machine;
}

export function MachineCard({ machine }: MachineCardProps) {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:scale-105">
        <div className="aspect-w-16 aspect-h-9">
          <img
            src={machine.image}
            alt={machine.name}
            className="w-full h-48 object-cover"
          />
        </div>
        <div className="p-6">
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
          <button 
            onClick={() => setIsOrderModalOpen(true)}
            className="mt-6 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
          >
            Order Now
          </button>
        </div>
      </div>

      <OrderMachineModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        machine={machine}
      />
    </>
  );
}