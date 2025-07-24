import React, { useState, useEffect } from 'react';
import IMG_0036 from '../assets/IMG_0036.jpg';
import IMG_0024 from '../assets/IMG_0024.jpg';
import IMG_0023 from '../assets/IMG_0023.jpg';

export function CocoDrinkEat() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const images = [IMG_0036, IMG_0024, IMG_0023];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [images.length]);
  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-8 lg:gap-12 items-center">
        {/* Left: Content */}
        <div className="w-full lg:w-1/2 space-y-6 lg:space-y-8">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-green-700 mb-2 flex items-center justify-center lg:justify-start">
              C<img src="/favicon.png" alt="o" className="h-4 md:h-5 lg:h-6 inline-block mx-[-6px] mt-[8px] md:mt-[10px] lg:mt-[12px] ms-[1.5px] mr-[1.5px]" />co DrinkEat
            </h2>
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 text-center lg:text-left">
              Event Experience
            </h3>
            <p className="text-lg md:text-xl text-gray-600 mt-4 text-center lg:text-left px-4 lg:px-0">
              We come to your event and give you the coconut experience
            </p>
            <ul className="space-y-3 mt-6 text-gray-600 max-w-md mx-auto lg:mx-0">
              <li className="flex items-center  lg:justify-start">
                <span className="w-2 h-2 bg-green-500 rounded-full mb-6 mr-3"></span>
                Fresh-cut coconuts with custom serving options
              </li>
              <li className="flex items-center  lg:justify-start">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Custom branded serving stations
              </li>
              <li className="flex items-center  lg:justify-start">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Sustainable and eco-friendly presentation
              </li>
              <li className="flex items-center  lg:justify-start">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Unique and memorable event experience
              </li>
            </ul>
          </div>

          <div className="flex justify-center lg:justify-start">
            <button className="bg-green-700 text-white px-6 md:px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-800 transition">
              Book Event Service
            </button>
          </div>
        </div>

        {/* Right: Image slideshow */}
        <div className="w-full lg:w-1/2 bg-gray-100 rounded-lg min-h-[300px] lg:min-h-[500px] order-first lg:order-last relative overflow-hidden">
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
