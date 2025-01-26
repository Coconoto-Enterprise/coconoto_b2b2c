import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { X, DollarSign } from 'lucide-react';
import { Product } from '../../types/product';

interface MakeOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

interface OfferFormData {
  price: number;
  quantity: number;
  message: string;
}

export function MakeOfferModal({ isOpen, onClose, product }: MakeOfferModalProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<OfferFormData>();

  const onSubmit = (data: OfferFormData) => {
    // Here you would typically send the offer to your backend
    console.log('Offer submitted:', {
      productId: product.id,
      ...data,
      totalValue: data.price * data.quantity
    });
    
    // Send email notification to seller (backend implementation required)
    // Add notification to seller's account (backend implementation required)
    
    reset();
    onClose();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title as="h3" className="text-lg font-medium text-gray-900">
                    Make an Offer
                  </Dialog.Title>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">{product.name}</h4>
                  <p className="text-sm text-gray-600">Current Price: ${product.price} per unit</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Your Offer Price (per unit)
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <DollarSign className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        {...register('price', { 
                          required: true,
                          min: 0,
                          max: product.price * 2
                        })}
                        className="block w-full pl-10 pr-4 py-2 rounded-md border-gray-300 focus:ring-green-500 focus:border-green-500"
                        placeholder="0.00"
                      />
                    </div>
                    {errors.price && (
                      <span className="text-red-500 text-sm">Please enter a valid price</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Quantity
                    </label>
                    <input
                      type="number"
                      {...register('quantity', { 
                        required: true,
                        min: 1,
                        max: product.quantity
                      })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
                    />
                    {errors.quantity && (
                      <span className="text-red-500 text-sm">
                        Quantity must be between 1 and {product.quantity}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Message to Seller
                    </label>
                    <textarea
                      {...register('message', { required: true })}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
                      placeholder="Introduce yourself and explain your requirements..."
                    />
                    {errors.message && (
                      <span className="text-red-500 text-sm">Message is required</span>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    Submit Offer
                  </button>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}