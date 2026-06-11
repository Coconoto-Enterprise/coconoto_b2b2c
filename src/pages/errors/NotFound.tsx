import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

export const NotFound = () => {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-20">
        <div className="max-w-md w-full text-center">
          {/* Error Code */}
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-[#8CC63F] opacity-80">404</h1>
            <div className="h-1 w-24 bg-[#8CC63F] mx-auto mt-2 rounded"></div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#8b5e47] mb-4">
              Page Not Found
            </h2>
            <p className="text-gray-600 text-lg">
              Oops! We couldn't find the page you're looking for. It might have been moved or deleted.
            </p>
          </div>

          {/* Coconut Illustration */}
          <div className="mb-12 text-6xl animate-bounce">
            🥥
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

          {/* Links to Popular Pages */}
          <div className="mt-12 pt-8 border-t border-gray-300">
            <p className="text-gray-600 text-sm mb-4">Or visit one of these pages:</p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate('/services')}
                className="text-[#8CC63F] hover:text-[#7ab32f] underline text-sm font-medium transition-colors"
              >
                Services
              </button>
              <span className="text-gray-400">•</span>
              <button
                onClick={() => navigate('/marketplace')}
                className="text-[#8CC63F] hover:text-[#7ab32f] underline text-sm font-medium transition-colors"
              >
                Marketplace
              </button>
              <span className="text-gray-400">•</span>
              <button
                onClick={() => navigate('/blog')}
                className="text-[#8CC63F] hover:text-[#7ab32f] underline text-sm font-medium transition-colors"
              >
                Blog
              </button>
              <span className="text-gray-400">•</span>
              <button
                onClick={() => navigate('/contact')}
                className="text-[#8CC63F] hover:text-[#7ab32f] underline text-sm font-medium transition-colors"
              >
                Contact
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NotFound;
