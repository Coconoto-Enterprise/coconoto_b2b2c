import React, { useState, useEffect } from 'react';
import { WaitlistModal } from './WaitlistModal';
import coconutwater11 from '../assets/coconutwater11.jpg';
import coconutstillinshell from '../assets/coconutstillinshell.avif';
import browncoconut from '../assets/browncoconut.avif';
import coconutoil from '../assets/coconutoil.jpg';

export function CocoConnect() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const images = [coconutwater11, coconutstillinshell, browncoconut, coconutoil];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="py-14 bg-gradient-to-b from-white to-gray-50 px-4 md:px-32">
      {/* Desktop & Tablet: flex-row, hidden on mobile */}
      <div className="max-w-7xl mx-auto px-5 hidden lg:flex flex-col lg:flex-row gap-4 lg:gap-16 items-center">
        {/* Left: Image slideshow */}
        <div className="w-full lg:w-1/2 relative overflow-hidden rounded-lg min-h-[240px] lg:min-h-[400px]">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Coconut processing ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover rounded-lg transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
        </div>

        {/* Right: Content */}
        <div className="w-full lg:w-1/2 space-y-6 lg:space-y-8">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-green-700 mb-2 flex items-center justify-center lg:justify-start">
              C<img src="/favicon.png" alt="o" className="h-4 md:h-5 lg:h-6 inline-block mx-[-6px] mt-[8px] md:mt-[10px] lg:mt-[12px] ms-[1.5px] mr-[1.5px]" />co-connect
            </h2>
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 text-center lg:text-left">
              Marketplace
            </h3>
            <p className="text-lg md:text-xl text-gray-600 mt-4 text-center lg:text-left px-4 lg:px-0">
              A Digital Marketplace for Everything Coconut
            </p>
            <ul className="space-y-3 mt-6 text-gray-600 max-w-md mx-auto lg:mx-0">
              <li className="flex items-center  lg:justify-start">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Access Quality Coconut product From verified suppliers
              </li>
              <li className="flex items-center  lg:justify-start">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Connect With Farmers and Processors
              </li>
            </ul>
            <p className="text-base md:text-lg text-gray-700 mt-4 italic text-center lg:text-left px-4 lg:px-0">
              Built for Coconut Farmers, Traders and Players
            </p>
          </div>

          <div className="flex justify-center lg:justify-start">
            <button
              className="bg-green-700 text-white px-6 md:px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-800 transition"
              onClick={() => setIsWaitlistModalOpen(true)}
            >
              Join Waitlist
            </button>
          </div>
        </div>
      </div>

      {/* Mobile: flex-col, text on top, image below, hidden on lg+ */}
      <div className="max-w-7xl mx-auto px-5 flex flex-col gap-4 items-center lg:hidden">
        {/* Content on top */}
        <div className="w-full space-y-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-green-700 mb-2 flex items-center justify-center">
              C<img src="/favicon.png" alt="o" className="h-4 md:h-5 inline-block mx-[-6px] mt-[8px] md:mt-[10px] ms-[1.5px] mr-[1.5px]" />co-connect
            </h2>
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 text-center">
              Marketplace
            </h3>
            <p className="text-lg md:text-xl text-gray-600 mt-4 text-center px-4">
              A Digital Marketplace for Everything Coconut
            </p>
            <ul className="space-y-3 mt-6 text-gray-600 max-w-md mx-auto">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3 mb-5 md:mb-0"></span>
                Access Quality Coconut product From verified suppliers
              </li>
              <li className="flex items-center justify-start">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Connect With Farmers and Processors
              </li>
            </ul>
            <p className="text-base md:text-lg text-gray-700 mt-4 italic px-4 lg:px-0 max-w-md mx-auto">
              Built for Coconut Farmers, Traders and Players
            </p>
          </div>

          <div className="flex justify-center">
            <button
              className="bg-green-700 text-white px-6 md:px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-800 transition"
              onClick={() => setIsWaitlistModalOpen(true)}
            >
              Join Waitlist
            </button>
          </div>
        </div>

        {/* Image slideshow below */}
        <div className="w-full lg:w-1/2 relative overflow-hidden rounded-lg min-h-[240px] md:min-h-[400px] lg:min-h-[400px]">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Coconut processing ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover rounded-lg transition-opacity duration-1000 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
        </div>
      </div>

      <WaitlistModal
        isOpen={isWaitlistModalOpen}
        onClose={() => setIsWaitlistModalOpen(false)}
      />
    </section>
  );
}
