import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../../assets/Logo_1.png';
import GoogleSearch1 from '../../assets/coconut_google_search.jpg';
import GoogleSearch2 from '../../assets/coconut_google_search.jpeg';
import { WaitlistModal } from '../../components/WaitlistModal';

export function ServicesHero() {
    const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  return (
    <section className="pt-16 md:pt-16 bg-gradient-to-b from-white to-gray-50 relative">
      <div className="max-w-full mx-auto">
        <div className="text-center px-6">
          <h1 className="text-3xl md:text-3xl lg:text-4xl mt-8 font-bold text-gray-900 mb-4">
            Industrial Solutions for Coconut <br />Processing with <img src={Logo} alt="Coconoto" className="h-7 md:h-8 lg:h-10 inline-block mb-2 md:mb-2 lg:mb-2 mr-2" />
          </h1>
          <p className="text-lg md:text-lg text-gray-600 mb-6 px-4 md:px-0">
            Welcome to Coconoto. <span className="md:hidden">A Smart Agritech company creating technology for the coconut value chain.</span><span className="hidden md:inline">We are a Smart Agritech company focused on creating technology, <br />Accessibility and Sustainability for the coconut value chain.</span>
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 px-4 md:px-0">
            <button 
              onClick={() => setIsWaitlistModalOpen(true)}
              className="bg-green-700 text-white px-6 md:px-8 py-2 rounded-full text-lg font-semibold hover:bg-green-800 transition text-center"
            >
              Join Waitlist
            </button>
<a 
  href="#machines"
  className="border-2 border-green-700 text-green-700 px-6 md:px-8 py-2 rounded-full text-lg font-semibold hover:bg-green-50 transition text-center"
>
  Learn More
</a>
          </div>
          <div className="mt-12 md:mt-0 mb-0">
            <div className="flex flex-row absolute left-0 right-0">
              <div className="overflow-hidden w-[150px] md:w-[340px] h-auto md:h-[200px] rounded-lg">
                <img src={GoogleSearch1} alt="Coconut Search 1" className="w-full" style={{marginTop: 0}} />
              </div>
              <div className="flex-grow" />
              <div className="overflow-hidden w-[150px] md:w-[340px] h-auto md:h-[200px] rounded-lg">
                <img src={GoogleSearch2} alt="Coconut Search 2" className="w-full" style={{marginTop: 0}} />
              </div>
            </div>
            <div className="h-[120px] md:h-[200px]"></div>
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
