import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/Logo_1.png';
import GoogleSearch1 from '../assets/coconut_google_search.jpg';
import GoogleSearch2 from '../assets/coconut_google_search.jpeg';

export function Hero() {
  return (
    <section className="pt-32 md:pt-40 bg-gradient-to-b from-white to-gray-50 relative">
      <div className="max-w-full mx-auto">
        <div className="text-center px-6">
          <h1 className="text-3xl md:text-4xl lg:text-5xl mt-8 font-bold text-gray-900 mb-6">
            Experience A Full <br />Coconut Cycle With <img src={Logo} alt="Coconoto" className="h-7 md:h-10 lg:h-12 inline-block mb-2 md:mb-3 lg:mb-4 mr-2" />
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 px-4 md:px-0">
            Welcome to Coconoto. <span className="md:hidden">A Smart Agritech company creating technology for the coconut value chain.</span><span className="hidden md:inline">We are a Smart Agritech company focused on creating technology, <br />Accessibility and Sustainability for the coconut value chain.</span>
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 px-4 md:px-0">
            <Link 
              to="/marketplace"
              className="bg-green-700 text-white px-6 md:px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-800 transition text-center"
            >
              Get Started
            </Link>
            <Link 
              to="/about"
              className="border-2 border-green-700 text-green-700 px-6 md:px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-50 transition text-center"
            >
              Learn More
            </Link>
          </div>
          <div className="mt-12 md:mt-12 mb-10">
            <div className="flex flex-row absolute left-0 right-0">
              <img src={GoogleSearch1} alt="Coconut Search 1" className="w-[150px] md:w-[400px] h-[100px] md:h-[250px] object-cover" />
              <div className="flex-grow" />
              <img src={GoogleSearch2} alt="Coconut Search 2" className="w-[150px] md:w-[400px] h-[100px] md:h-[250px] object-cover" />
            </div>
            <div className="h-[120px] md:h-[250px]"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
