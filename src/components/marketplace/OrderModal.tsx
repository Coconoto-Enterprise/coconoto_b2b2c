import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { X, CreditCard, Truck } from 'lucide-react';
import { Product } from '../../types/product';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

interface OrderFormData {
  quantity: number;
  shippingAddress: string;
  paymentMethod: 'coconotopay' | 'card' | 'bank';
  notes: string;
}

export function OrderModal({ isOpen, onClose, product }: OrderModalProps) {
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<OrderFormData>();
  const quantity = watch('quantity', 1);
  const total = quantity * product.price;

  const onSubmit = (data: OrderFormData) => {
    // Here you would typically send the order to your backend
    console.log('Order submitted:', {
      productId: product.id,
      ...data,
      totalAmount: total
    });
    
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
                    Place Order
                  </Dialog.Title>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">{product.name}</h4>
                  <p className="text-sm text-gray-600">Unit Price: ${product.price}</p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                      Shipping Address
                    </label>
                    <textarea
                      {...register('shippingAddress', { required: true })}
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
                    />
                    {errors.shippingAddress && (
                      <span className="text-red-500 text-sm">Shipping address is required</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Payment Method
                    </label>
                    <div className="mt-2 space-y-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="coconotopay"
                          {...register('paymentMethod', { required: true })}
                          className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">CoconotoPay (Recommended)</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="card"
                          {...register('paymentMethod', { required: true })}
                          className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">Credit/Debit Card</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          value="bank"
                          {...register('paymentMethod', { required: true })}
                          className="focus:ring-green-500 h-4 w-4 text-green-600 border-gray-300"
                        />
                        <span className="ml-2 text-sm text-gray-700">Bank Transfer</span>
                      </label>
                    </div>
                    {errors.paymentMethod && (
                      <span className="text-red-500 text-sm">Please select a payment method</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Additional Notes
                    </label>
                    <textarea
                      {...register('notes')}
                      rows={2}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
                      placeholder="Any special instructions..."
                    />
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="font-medium">${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">Shipping:</span>
                      <span className="font-medium">Calculated at checkout</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-green-600">${total.toFixed(2)}*</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">*Excluding shipping</p>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center"
                  >
                    <CreditCard className="h-5 w-5 mr-2" />
                    Place Order
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