import React, { useState, useEffect } from 'react';
import manplanting from '../assets/manplanting.jpg';
import cocoplant from '../assets/cocoplant.jpg';
import cocofiber from '../assets/cocofiber.png';
import cocopeat from '../assets/cocopeat.jpg';
import fiber2 from '../assets/fiber2.jpg';
import cocpeat1 from '../assets/cocpeat1.jpeg';
import fiber from '../assets/fiber.jpeg';
import cocopot from '../assets/cocopot.jpg';

export function CococycleHub() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [manplanting, cocoplant, cocofiber, cocopeat, fiber2, cocpeat1, fiber, cocopot];

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
      <div className="max-w-7xl mx-auto px-5 flex flex-col lg:flex-row gap-4 lg:gap-16 items-center">
        {/* Left: Content */}
        <div className="w-full lg:w-1/2 space-y-6 lg:space-y-8">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-green-700 mb-4 flex items-center justify-center lg:justify-start">
              C<img src="/favicon.png" alt="o" className="h-4 md:h-5 lg:h-6 inline-block mx-[-6px] mt-[8px] md:mt-[10px] lg:mt-[12px] ms-[1.5px] mr-[1.5px]" />cocycle Hub
            </h2>
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 text-center lg:text-left">
              Product Sales
            </h3>
          </div>

          <div className="space-y-4 lg:space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-1 md:gap-2 lg:gap-3 text-center lg:text-left justify-center lg:justify-start flex-nowrap">
                <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-green-800 whitespace-nowrap">Cocopeat</h3>
                <span className="text-sm md:text-base text-gray-600">– nutrient‑rich growing medium.</span>
              </div>

              <div className="flex items-center gap-1 md:gap-2 lg:gap-3 text-center lg:text-left justify-center lg:justify-start flex-nowrap">
                <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-green-800 whitespace-nowrap">Fiber</h3>
                <span className="text-sm md:text-base text-gray-600">– durable material for crafts and packaging.</span>
              </div>

              <div className="flex items-center gap-1 md:gap-2 lg:gap-3 text-center lg:text-left justify-center lg:justify-start flex-nowrap">
                <h3 className="text-lg md:text-xl lg:text-2xl font-semibold text-green-800 whitespace-nowrap">Cocopot</h3>
                <span className="text-sm md:text-base text-gray-600">– eco‑friendly plant containers.</span>
              </div>
            </div>

            <div className="flex justify-center lg:justify-start">
              <button className="bg-green-700 text-white px-6 md:px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-800 transition">
                View Products
              </button>
            </div>
          </div>
        </div>

        {/* Right: Image slideshow */}
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
      </div>
    </section>
  );
}
