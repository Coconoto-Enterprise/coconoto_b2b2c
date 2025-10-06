import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/Logo_1.png';
import GoogleSearch1 from '../assets/coconut_google_search.png';
import GoogleSearch2 from '../assets/coconut_google_search-2.png';
import { WaitlistModal } from './WaitlistModal';

export function Hero() {
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  return (
    <section className="pt-44 md:pt-[359px] lg:pt-60 bg-gradient-to-b from-white to-gray-50 relative">
      <div className="max-w-full mx-auto">
        <div className="text-center px-6">
          <h1 className="text-3xl md:text-4xl lg:text-4xl mt-8 font-bold text-gray-900 mb-4">
            Welcome to Coconoto
          </h1>
          <p className="text-lg md:text-xl lg:text-lg text-gray-600 mb-8 px-4 md:px-0">
<span className="md:hidden">A Climate Smart Agritech company creating technology for the coconut value chain.</span><span className="hidden md:inline">We are a Smart Agritech company focused on creating technology, <br />Accessibility and Sustainability for the coconut value chain.</span>
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 px-4 md:px-0">
            <button 
              onClick={() => setIsWaitlistModalOpen(true)}
              className="bg-green-700 text-white px-6 md:px-8 py-2 rounded-full text-lg font-semibold hover:bg-green-800 transition text-center"
            >
              Join Waitlist
            </button>
            <a
              href="#cocotech"
              className="border-2 border-green-700 text-green-700 px-6 md:px-8 py-2 rounded-full text-lg font-semibold hover:bg-green-50 transition text-center"
            >
              Learn More
            </a>
          </div>
          <div className="mt-[12vh] md:mt-[20vh] lg:mt-[12vh] mb-0">
            <div className="flex flex-row absolute left-0 right-0">
              <div className="overflow-hidden w-[150px] md:w-[340px] h-auto md:h-[25vh] rounded-lg">
                <img src={GoogleSearch1} alt="Coconut Search 1" className="w-full" style={{marginTop: 0}} />
              </div>
              <div className="flex-grow" />
              <div className="overflow-hidden w-[150px] md:w-[340px] h-auto md:h-[25vh] rounded-lg">
                <img src={GoogleSearch2} alt="Coconut Search 2" className="w-full" style={{marginTop: 0}} />
              </div>
            </div>
            <div className="h-[15vh] md:h-[25vh]"></div>
          </div>
        </div>
      </div>

      <WaitlistModal
        isOpen={isWaitlistModalOpen}
        onClose={() => setIsWaitlistModalOpen(false)}
      />
    </section>
    
  );
}
