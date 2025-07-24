import React from 'react';
import Logo from '../../assets/Logo_1.png';
import GoogleSearch1 from '../../assets/coconut_google_search.jpg';
import GoogleSearch2 from '../../assets/coconut_google_search.jpeg';

export function ServicesHero() {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl mt-12 font-bold text-gray-900 mb-6">
            Industrial Solutions for Coconut Processing with <img src={Logo} alt="Coconoto" className="h-12 inline-block mb-4 mr-2" />
          </h1>
          <p className="text-xl text-gray-600 mb-12">
            Complete end-to-end solutions for coconut processing, from machinery to facility construction
            and production optimization.
          </p>
          <a 
            href="#contact"
            className="bg-green-700 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-800 transition"
          >
            Get Started
          </a>

                    <div className="mt-12">
                      <div className="flex absolute left-0 right-0">
                        <img src={GoogleSearch1} alt="Coconut Search 1" className="w-[400px] h-[250px] object-cover" />
                        <div className="flex-grow" />
                        <img src={GoogleSearch2} alt="Coconut Search 2" className="w-[400px] h-[250px] object-cover" />
                      </div>
                      <div className="h-[250px]"></div>
                    </div>

        </div>
      </div>
    </section>
  );
}
