import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, AlertTriangle } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export const ServerError = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center px-4 py-20">
        <div className="max-w-md w-full text-center">
          {/* Error Code */}
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-red-500 opacity-80">500</h1>
            <div className="h-1 w-24 bg-red-500 mx-auto mt-2 rounded"></div>
          </div>

          {/* Error Icon */}
          <div className="mb-6 flex justify-center">
            <div className="p-4 bg-red-100 rounded-full">
              <AlertTriangle size={48} className="text-red-600" />
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#8b5e47] mb-4">
              Server Error
            </h2>
            <p className="text-gray-600 text-lg">
              Something went wrong on our end. Our team has been notified and is working to fix it. Please try again later.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#8b5e47] text-white rounded-lg hover:bg-[#6d4a38] transition-colors font-medium"
            >
              <ArrowLeft size={20} />
              Go Back
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#8CC63F] text-white rounded-lg hover:bg-[#7ab32f] transition-colors font-medium"
            >
              <Home size={20} />
              Go Home
            </button>
          </div>

          {/* Support Info */}
          <div className="mt-12 pt-8 border-t border-gray-300">
            <p className="text-gray-600 text-sm mb-3">Need immediate assistance?</p>
            <button
              onClick={() => navigate('/contact')}
              className="inline-block px-6 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors font-medium text-sm"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ServerError;
