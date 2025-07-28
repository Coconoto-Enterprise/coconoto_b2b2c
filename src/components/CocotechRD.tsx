import React, { useState, useEffect } from 'react';
import IMG_0036 from '../assets/IMG_0036.jpg';
import IMG_0024 from '../assets/IMG_0024.jpg';
import IMG_0023 from '../assets/IMG_0023.jpg';

export function CocotechRD() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [IMG_0036, IMG_0024, IMG_0023];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <section className="py-14 bg-gradient-to-b from-white to-gray-50 px-4 md:px-32">
      <div className="max-w-7xl mx-auto px-5 flex flex-col lg:flex-row gap-4 lg:gap-16 items-center">
        {/* Left: Image slideshow */}
        <div className="w-full lg:w-1/2 relative overflow-hidden rounded-lg min-h-[240px] lg:min-h-[400px]">
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
          <div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-green-700 mb-0 flex items-center justify-center lg:justify-start">
              C<img src="/favicon.png" alt="o" className="h-3 md:h-4 lg:h-5 inline-block mx-[-5px] mt-[6px] md:mt-[8px] lg:mt-[10px] ms-[1px] mr-[1px]" />co-Tech
            </h2>
            <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 text-center lg:text-left">
              Dehusking & Deshelling
            </h3>
          </div>

          <div className="space-y-2 lg:space-y-3">
            <div>
              <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-1 text-center lg:text-left">
                Our Machines
              </h3>
              <p className="text-gray-600 leading-relaxed text-center lg:text-left px-2 lg:px-0">
                We design and manufacture affordable, locally built machines using steel frames, 
                rollers, levers, and blades to remove coconut husks and shells efficiently—without 
                damaging the kernel.
              </p>
            </div>

            <div>
              <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-1 text-center lg:text-left">
                Processing Services
              </h3>
              <p className="text-gray-600 mb-2 text-center lg:text-left px-2 lg:px-0">
                Fast, cost-effective coconut processing
              </p>
              <ul className="space-y-0.5 text-gray-600 max-w-md mx-auto lg:mx-0">
                <li className="flex items-center justify-center lg:justify-start">
                  <span className="w-1 h-1 bg-green-500 rounded-full mr-1"></span>
                  120 coconuts/hour dehusked
                </li>
                <li className="flex items-center justify-center lg:justify-start">
                  <span className="w-1 h-1 bg-green-500 rounded-full mr-1"></span>
                  195 nuts/hour deshelled
                </li>
              </ul>
              <p className="text-gray-600 mt-2 text-center lg:text-left px-2 lg:px-0">
                Ideal for smallholder farmers and processors who want to scale efficiently.
              </p>
            </div>

            <div className="flex justify-center lg:justify-start">
              <button className="bg-green-700 text-white px-4 md:px-5 py-2 rounded-full text-sm font-semibold hover:bg-green-800 transition">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
