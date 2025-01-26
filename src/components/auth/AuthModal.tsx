import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { testAccounts } from '../../data/testCredentials';
import { useNavigate } from 'react-router-dom';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: 'signup' | 'login';
}

interface FormData {
  email: string;
  password: string;
  name?: string;
  accountType: 'buyer' | 'seller';
}

export function AuthModal({ isOpen, onClose, initialMode }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(initialMode === 'signup');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>();

  useEffect(() => {
    setIsSignUp(initialMode === 'signup');
  }, [initialMode]);

  const onSubmit = (data: FormData) => {
    const testAccount = data.accountType === 'buyer' ? testAccounts.buyer : testAccounts.seller;
    
    if (data.email === testAccount.email && data.password === testAccount.password) {
      login({
        id: '1',
        name: testAccount.name,
        email: data.email,
        accountType: data.accountType,
        company: testAccount.company,
        location: testAccount.location
      });
      reset();
      setError('');
      onClose();
      navigate('/marketplace'); // Redirect to marketplace after successful login
    } else {
      setError('Invalid credentials. Please use the test account credentials.');
    }
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
                  <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                    {isSignUp ? 'Create Account' : 'Sign In'}
                  </Dialog.Title>
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
                    {error}
                  </div>
                )}

                <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-md text-sm">
                  <strong>Test Accounts:</strong><br />
                  Buyer: {testAccounts.buyer.email} / {testAccounts.buyer.password}<br />
                  Seller: {testAccounts.seller.email} / {testAccounts.seller.password}
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {isSignUp && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        {...register('name', { required: isSignUp })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                      />
                      {errors.name && <span className="text-red-500 text-sm">Name is required</span>}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      {...register('email', { required: true })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                    {errors.email && <span className="text-red-500 text-sm">Email is required</span>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                      type="password"
                      {...register('password', { required: true })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    />
                    {errors.password && <span className="text-red-500 text-sm">Password is required</span>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Account Type</label>
                    <select
                      {...register('accountType', { required: true })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                    >
                      <option value="buyer">Buyer</option>
                      <option value="seller">Seller</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    {isSignUp ? 'Sign Up' : 'Sign In'}
                  </button>
                </form>

                <div className="mt-4 text-center">
                  <button
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="text-sm text-green-600 hover:text-green-500"
                  >
                    {isSignUp
                      ? 'Already have an account? Sign in'
                      : "Don't have an account? Sign up"}
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}