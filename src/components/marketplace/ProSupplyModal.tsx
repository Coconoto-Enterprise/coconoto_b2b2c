import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { X, Building2, Truck, Calendar } from 'lucide-react';

interface ProSupplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: {
    product: string;
    quantity: string;
    unit: string;
    price: number;
    location: string;
    deadline: string;
  };
}

interface SupplyFormData {
  // Personal Details
  fullName: string;
  email: string;
  phone: string;
  position: string;

  // Company Details
  companyName: string;
  companyAddress: string;
  yearsInBusiness: number;
  annualRevenue: string;
  
  // Supply Capability
  currentStock: number;
  monthlyCapacity: number;
  earliestDelivery: string;
  certifications: string;
  
  // Additional Information
  priceOffer: number;
  transportationMethod: string;
  additionalNotes: string;
}

export function ProSupplyModal({ isOpen, onClose, request }: ProSupplyModalProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<SupplyFormData>();

  const onSubmit = (data: SupplyFormData) => {
    console.log('Supply form submitted:', data);
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title as="h3" className="text-lg font-medium text-gray-900">
                    Supply Request Form - Coconoto Pro
                  </Dialog.Title>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Request Details */}
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <h4 className="font-medium text-blue-900 mb-2">Request Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm text-blue-800">
                    <div>
                      <p><strong>Product:</strong> {request.product}</p>
                      <p><strong>Quantity:</strong> {request.quantity} {request.unit}</p>
                      <p><strong>Price:</strong> ${request.price} per {request.unit}</p>
                    </div>
                    <div>
                      <p><strong>Location:</strong> {request.location}</p>
                      <p><strong>Deadline:</strong> {new Date(request.deadline).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Personal Details */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Personal Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input
                          type="text"
                          {...register('fullName', { required: true })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                          type="email"
                          {...register('email', { required: true })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Phone</label>
                        <input
                          type="tel"
                          {...register('phone', { required: true })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Position</label>
                        <input
                          type="text"
                          {...register('position', { required: true })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Company Details */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Company Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Company Name</label>
                        <input
                          type="text"
                          {...register('companyName', { required: true })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Company Address</label>
                        <input
                          type="text"
                          {...register('companyAddress', { required: true })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Years in Business</label>
                        <input
                          type="number"
                          {...register('yearsInBusiness', { required: true, min: 0 })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Annual Revenue</label>
                        <select
                          {...register('annualRevenue', { required: true })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        >
                          <option value="">Select range</option>
                          <option value="<1M">Less than $1M</option>
                          <option value="1M-5M">$1M - $5M</option>
                          <option value="5M-10M">$5M - $10M</option>
                          <option value="10M+">More than $10M</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Supply Capability */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Supply Capability</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Current Stock ({request.unit})</label>
                        <input
                          type="number"
                          {...register('currentStock', { required: true, min: 0 })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Monthly Capacity ({request.unit})</label>
                        <input
                          type="number"
                          {...register('monthlyCapacity', { required: true, min: 0 })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Earliest Delivery Date</label>
                        <input
                          type="date"
                          {...register('earliestDelivery', { required: true })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Certifications</label>
                        <input
                          type="text"
                          {...register('certifications')}
                          placeholder="ISO, HACCP, etc."
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Price Offer (per {request.unit})</label>
                        <input
                          type="number"
                          step="0.01"
                          {...register('priceOffer', { required: true, min: 0 })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Transportation Method</label>
                        <select
                          {...register('transportationMethod', { required: true })}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                        >
                          <option value="">Select method</option>
                          <option value="sea">Sea Freight</option>
                          <option value="air">Air Freight</option>
                          <option value="road">Road Transport</option>
                          <option value="rail">Rail Transport</option>
                        </select>
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700">Additional Notes</label>
                        <textarea
                          {...register('additionalNotes')}
                          rows={3}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                          placeholder="Any additional information about your supply capability..."
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    Submit Supply Request
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