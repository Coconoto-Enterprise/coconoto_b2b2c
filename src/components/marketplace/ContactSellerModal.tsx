import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useForm } from 'react-hook-form';
import { X, AlertTriangle } from 'lucide-react';
import { Seller } from '../../types/product';

interface ContactSellerModalProps {
  isOpen: boolean;
  onClose: () => void;
  seller: Seller;
}

interface ContactFormData {
  subject: string;
  message: string;
  urgency: 'low' | 'medium' | 'high';
}

export function ContactSellerModal({ isOpen, onClose, seller }: ContactSellerModalProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    // Send notification email via Resend API
    try {
      await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject: 'Contact Seller Message - Coconoto',
          message: `Contact Seller Message Received:

Seller Information:
Name: ${seller.name}
Email: ${seller.email}

Message Details:
Subject: ${data.subject}
Message: ${data.message}
Urgency: ${data.urgency}

Message sent at: ${new Date().toLocaleString()}`
        })
      });
    } catch (emailError) {
      console.error('Failed to send notification email:', emailError);
    }
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
                    Contact {seller.name}
                  </Dialog.Title>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Subject
                    </label>
                    <input
                      type="text"
                      {...register('subject', { required: true })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
                      placeholder="What is this regarding?"
                    />
                    {errors.subject && (
                      <span className="text-red-500 text-sm">Subject is required</span>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Urgency Level
                    </label>
                    <select
                      {...register('urgency', { required: true })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="low">Low - General Inquiry</option>
                      <option value="medium">Medium - Need Response Soon</option>
                      <option value="high">High - Urgent Matter</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Message
                    </label>
                    <textarea
                      {...register('message', { required: true })}
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
                      placeholder="Type your message here..."
                    />
                    {errors.message && (
                      <span className="text-red-500 text-sm">Message is required</span>
                    )}
                  </div>

                  <div className="bg-yellow-50 p-3 rounded-md">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="h-5 w-5 text-yellow-400" />
                      <span className="text-sm text-yellow-800">
                        Average response time: &lt; 24 hours
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    Send Message
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