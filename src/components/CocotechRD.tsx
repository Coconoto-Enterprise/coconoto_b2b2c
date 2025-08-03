import React, { useState, useEffect } from 'react';
import IMG_0036 from '../assets/IMG_0036.jpg';
import IMG_0024 from '../assets/IMG_0024.jpg';
import IMG_0023 from '../assets/IMG_0023.jpg';
import IMG_20250311_180248 from '../assets/IMG_20250311_180248.jpg';
import dehusking from '../assets/dehusking.jpg';
import dehusking2 from '../assets/dehusking2.jpg';
import IMG_0369 from '../assets/IMG_0369.jpg';

export function CocotechRD() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [IMG_0036, IMG_0024, IMG_0023, IMG_20250311_180248, dehusking, dehusking2, IMG_0369];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section id="cocotech" className="py-14 bg-gradient-to-b from-white to-gray-50 px-4 md:px-32">
      {/* Desktop & Tablet: flex-row, hidden on mobile */}
      <div className="max-w-7xl mx-auto px-5 hidden lg:flex flex-col lg:flex-row gap-4 lg:gap-16 items-center">
        {/* Left: Image slideshow */}
        <div className="w-full lg:w-1/2 relative overflow-hidden rounded-lg min-h-[240px] md:min-h-[400px] lg:min-h-[400px]">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Coconut processing machine ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-800 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
        </div>
        {/* Right: Content */}
        <div className="w-full lg:w-1/2 space-y-3 lg:space-y-4">
          {/* ...existing content... */}
          <div>
            <h2 className="text-2xl md:text-4xl lg:text-4xl font-bold text-green-700 mb-2 flex items-center justify-center lg:justify-start">
              C<img src="/favicon.png" alt="o" className="h-4 md:h-5 lg:h-6 inline-block mx-[-6px] mt-[8px] md:mt-[10px] lg:mt-[12px] ms-[1.5px] mr-[1.5px]" />co-Tech
            </h2>
            <h3 className="text-xl md:text-3xl lg:text-3xl font-bold text-gray-900 text-center lg:text-left mb-4">
              Dehusking & Deshelling
            </h3>
          </div>
          <div className="space-y-2 lg:space-y-3">
            <div>
              <h3 className="text-lg md:text-2xl font-semibold text-gray-800 mb-2 text-center lg:text-left">
                Our Machines
              </h3>
              <p className="text-gray-600 text-base md:text-xl leading-relaxed text-center lg:text-left px-2 lg:px-0 mb-4">
                We design and manufacture efficient Dehusking & Deshelling Machines for the Coconut value Chain
              </p>
            </div>
            <div>
              <h3 className="text-lg md:text-2xl font-semibold text-gray-800 mb-2 text-center lg:text-left">
                Processing Services
              </h3>
              <p className="text-gray-600 text-base md:text-xl mb-4 text-center lg:text-left px-2 lg:px-0">
                Fast, cost-effective coconut processing
              </p>
              <ul className="space-y-2 text-gray-600 max-w-md mx-auto lg:mx-0">
                <li className="flex items-center justify-center lg:justify-start text-base md:text-xl">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  500-900 coconuts/hour dehusked
                </li>
                <li className="flex items-center justify-center lg:justify-start text-base md:text-xl">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  240-400 nuts/hour deshelled
                </li>
              </ul>
              <p className="text-gray-600 mt-4 text-center lg:text-left px-2 lg:px-0 text-base md:text-xl">
                Ideal for smallholder farmers and processors who want to scale efficiently.
              </p>
            </div>
            <div className="flex justify-center lg:justify-start">
              <a
                href="/services"
                className="bg-green-700 text-white px-6 md:px-8 py-3 rounded-full text-sm font-semibold hover:bg-green-800 transition"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: flex-col, text on top, image below, hidden on lg+ */}
      <div className="max-w-7xl mx-auto px-5 flex flex-col gap-4 items-center lg:hidden">
        {/* Content on top */}
        <div className="w-full space-y-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-green-700 mb-0 flex items-center justify-center">
              C<img src="/favicon.png" alt="o" className="h-3 md:h-4 inline-block mx-[-5px] mt-[6px] md:mt-[8px] ms-[1px] mr-[1px]" />co-Tech
            </h2>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 text-center">
              Dehusking & Deshelling
            </h3>
          </div>
          <div className="space-y-2">
            <div>
              <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-1 text-center">
                Our Machines
              </h3>
              <p className="text-gray-600 leading-relaxed text-center px-2">
                We design and manufacture efficient Dehusking & Deshelling Machines for the Coconut value Chain
              </p>
            </div>
            <div>
              <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-1 text-center">
                Processing Services
              </h3>
              <p className="text-gray-600 mb-2 text-center px-2">
                Fast, cost-effective coconut processing
              </p>
              <ul className="space-y-0.5 text-gray-600 max-w-md mx-auto">
                <li className="flex items-center justify-center">
                  <span className="w-1 h-1 bg-green-500 rounded-full mr-1"></span>
                  500-900 coconuts/hour dehusked
                </li>
                <li className="flex items-center justify-center">
                  <span className="w-1 h-1 bg-green-500 rounded-full mr-1"></span>
                  240-400 nuts/hour deshelled
                </li>
              </ul>
              <p className="text-gray-600 mt-2 text-center px-2">
                Ideal for smallholder farmers and processors who want to scale efficiently.
              </p>
            </div>
            <div className="flex justify-center">
              <a
                href="/services"
                className="bg-green-700 text-white px-6 md:px-8 py-3 rounded-full text-sm font-semibold hover:bg-green-800 transition"
              >
                Learn More
              </a>
            </div>
          </div>
        </div>
        {/* Image slideshow below */}
        <div className="w-full relative overflow-hidden rounded-lg min-h-[240px] md:min-h-[400px]">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Coconut processing machine ${index + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-800 ${
                index === currentImageIndex ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
