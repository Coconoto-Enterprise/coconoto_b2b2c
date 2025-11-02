import React, { useState } from 'react';
import { Leaf, Users, Recycle, ShoppingBag, Calendar } from 'lucide-react';
import { WaitlistModal } from './WaitlistModal';
import GoogleSearch1 from '../assets/coconut_google_search.png';
import GoogleSearch2 from '../assets/coconut_google_search-2.png';
import Threads from './Threads';

export function About() {
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-gray-50">
      {/* Hero / Opening Statement */}
      <div className="relative bg-white text-gray-900 text-center overflow-hidden">
        {/* Threads Background */}
        <div className="absolute inset-0 w-full h-full opacity-30">
          <Threads
            color={[0.133, 0.545, 0.133]}
            amplitude={2}
            distance={1}
            enableMouseInteraction={false}
          />
        </div>
        
        <div className="relative z-10 container mx-auto px-6 mt-[37vh]">
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold mb-6 tracking-tight">
            About <span className="text-green-700">Coconoto</span>
          </h1>
          <p className="text-lg md:text-xl lg:text-3xl max-w-4xl mx-auto text-gray-600 leading-relaxed font-medium px-4 md:px-0 mb-12">
            <span className="md:hidden">The Smart Agri-Tech company transforming the coconut value chain through innovation, accessibility, and sustainability.</span>
            <span className="hidden md:inline">The Smart Agritech company focused on creating technology, <br />Accessibility and Sustainability for the coconut value chain.</span>
          </p>
          <div className="mt-[12vh] md:mt-[20vh] lg:mt-[17vh] mb-0">
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

      {/* Sustainability Problem */}
      <div className="bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">The Problem We're Solving</h2>
              <div className="w-24 h-1 bg-red-600 mx-auto mb-6"></div>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                A massive environmental crisis hiding in plain sight
              </p>
            </div>

            {/* Main Problem Statement */}
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-8">
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-6 text-white">
                <div className="flex items-center justify-center mb-4">
                  <span className="text-6xl mr-4">⚠️</span>
                  <h3 className="text-3xl font-bold">The Coconut Waste Crisis</h3>
                </div>
              </div>
              <div className="p-8 md:p-12">
                <div className="text-center mb-8">
                  <div className="text-7xl font-bold text-red-600 mb-2">80%</div>
                  <p className="text-2xl text-gray-800 font-semibold mb-4">
                    of coconut waste ends up in landfills or gets burned
                  </p>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Every day, massive amounts of coconut husks and shells are discarded, filling up landfills or being set ablaze — releasing <span className="font-semibold text-red-600">harmful carbon emissions</span> into our atmosphere and contributing to climate change.
                  </p>
                </div>
              </div>
            </div>

            {/* Statistics Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* Nigeria Consumption */}
              <div className="bg-white rounded-xl shadow-lg p-8 text-center transform hover:scale-105 transition duration-300">
                <div className="text-5xl mb-3">📊</div>
                <div className="text-4xl font-bold text-blue-600 mb-2">267,000</div>
                <p className="text-gray-800 font-semibold mb-2">Metric Tonnes</p>
                <p className="text-sm text-gray-600">
                  Nigeria's annual coconut consumption
                </p>
              </div>

              {/* Waste Generated */}
              <div className="bg-white rounded-xl shadow-lg p-8 text-center transform hover:scale-105 transition duration-300">
                <div className="text-5xl mb-3">🗑️</div>
                <div className="text-4xl font-bold text-orange-600 mb-2">125,490</div>
                <p className="text-gray-800 font-semibold mb-2">Tonnes Wasted</p>
                <p className="text-sm text-gray-600">
                  47% husk and shells thrown away annually
                </p>
              </div>

              {/* Market Opportunity */}
              <div className="bg-white rounded-xl shadow-lg p-8 text-center transform hover:scale-105 transition duration-300">
                <div className="text-5xl mb-3">💰</div>
                <div className="text-4xl font-bold text-green-600 mb-2">$12.88B</div>
                <p className="text-gray-800 font-semibold mb-2">Market Value</p>
                <p className="text-sm text-gray-600">
                  Industrial processing opportunity (USD)
                </p>
              </div>
            </div>

            {/* The Impact */}
            <div className="bg-white rounded-xl shadow-xl p-8 md:p-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">The Environmental & Economic Impact</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-xl font-bold text-red-600 mb-4 flex items-center">
                    <span className="text-2xl mr-2">🌍</span>
                    Environmental Damage
                  </h4>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      <span>Carbon emissions from burning coconut waste contribute to climate change</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      <span>Landfills overflow with organic waste that could be repurposed</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      <span>Methane gas released from decomposing husks in landfills</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-red-500 mr-2">•</span>
                      <span>Loss of valuable biomass that could enrich soil and support agriculture</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-orange-600 mb-4 flex items-center">
                    <span className="text-2xl mr-2">💸</span>
                    Economic Loss
                  </h4>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      <span>Farmers miss out on additional income from waste products</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      <span>Potential jobs in waste processing remain uncreated</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      <span>$12.88 billion market opportunity largely untapped</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2">•</span>
                      <span>Communities lose access to affordable, sustainable products</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Our Solution CTA */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl shadow-xl p-8 mt-8 text-center text-white">
              <h3 className="text-3xl font-bold mb-4">But There's Hope 🌱</h3>
              <p className="text-xl text-green-100 mb-6 leading-relaxed">
                At Coconoto, we believe this "waste" is actually a <span className="font-bold text-white">valuable resource</span> waiting to be transformed. We're turning this environmental crisis into an economic opportunity — creating jobs, empowering farmers, and protecting our planet.
              </p>
              <div className="inline-block bg-white text-green-700 px-8 py-3 rounded-lg font-bold text-lg">
                Our mission: Eliminate 80% of coconut waste ♻️
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Mission */}
      <div className="bg-gradient-to-br from-green-600 to-green-700 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Mission</h2>
              <div className="w-24 h-1 bg-green-300 mx-auto mb-6"></div>
            </div>
            
            <div className="text-center mb-10">
              <p className="text-2xl md:text-3xl text-white font-semibold leading-relaxed">
                Our mission is to build a circular and technology-enabled coconut economy that empowers farmers, creates jobs, and promotes eco-friendly practices.
              </p>
            </div>

            {/* Mission Pillars */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center hover:bg-white/20 transition duration-300">
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">👨‍🌾</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Empowering Farmers</h3>
                <p className="text-green-100 text-sm leading-relaxed">
                  Providing farmers with technology, market access, and fair prices for their coconuts and waste products
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center hover:bg-white/20 transition duration-300">
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">💼</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Creating Jobs</h3>
                <p className="text-green-100 text-sm leading-relaxed">
                  Generating decent employment opportunities across the value chain, with focus on youths
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 text-center hover:bg-white/20 transition duration-300">
                <div className="bg-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-4xl">♻️</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">Transforming Waste</h3>
                <p className="text-green-100 text-sm leading-relaxed">
                  Converting 80% of coconut waste into valuable, eco-friendly products that benefit people and planet
                </p>
              </div>
            </div>

            {/* Mission Statement Box */}
            <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-10 mt-12">
              <div className="text-center">
                <p className="text-xl md:text-2xl text-gray-800 leading-relaxed mb-6">
                  We are committed to building a <span className="font-bold text-green-700">sustainable, profitable, and inclusive</span> coconut ecosystem where:
                </p>
                <div className="grid md:grid-cols-2 gap-6 text-left">
                  <div className="flex items-start">
                    <span className="text-green-600 text-2xl mr-3">✓</span>
                    <p className="text-gray-700">
                      <span className="font-semibold">Farmers prosper</span> with fair prices and modern technology
                    </p>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-600 text-2xl mr-3">✓</span>
                    <p className="text-gray-700">
                      <span className="font-semibold">Communities thrive</span> through job creation and economic growth
                    </p>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-600 text-2xl mr-3">✓</span>
                    <p className="text-gray-700">
                      <span className="font-semibold">Waste becomes wealth</span> through circular economy practices
                    </p>
                  </div>
                  <div className="flex items-start">
                    <span className="text-green-600 text-2xl mr-3">✓</span>
                    <p className="text-gray-700">
                      <span className="font-semibold">Environment heals</span> as we eliminate carbon emissions and landfill waste
                    </p>
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <p className="text-lg text-gray-600 italic">
                    "Every coconut tells a story of sustainability, every farmer represents hope, and every product we create is a step toward a greener Africa."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What We Do */}
      <div className="container mx-auto px-6 mt-20">
        <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">What We Do</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Coco-Tech */}
          <div 
            onClick={() => scrollToSection('cocotech-section')}
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 border-2 border-amber-500 cursor-pointer"
          >
            <div className="bg-amber-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <Leaf className="w-8 h-8 text-amber-700" />
            </div>
            <h3 className="text-2xl font-bold text-amber-700 mb-4">🌿 Coco-Tech</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              We design, fabricate, and sell innovative coconut processing machines for the entire value chain.
            </p>
            <div className="text-sm text-gray-700 space-y-2">
              <p className="font-semibold text-amber-700">Our Machines:</p>
              <p>✓ Dehusking Machine (500-900 nuts/hr)</p>
              <p>✓ Deshelling Machine (240-400 nuts/hr)</p>
              <p>✓ Decorticator (Separates cocopeat from husk)</p>
              <p>✓ Coconut Milk Extractor (Automatic & Manual)</p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm font-semibold text-amber-700">
                Patented technology - Made locally
              </p>
            </div>
          </div>

          {/* Cococycle Hub */}
          <div 
            onClick={() => scrollToSection('cococycle-section')}
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 border-2 border-green-500 cursor-pointer"
          >
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <Recycle className="w-8 h-8 text-green-700" />
            </div>
            <h3 className="text-2xl font-bold text-green-700 mb-4">🔄 Cococycle Hub</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              We convert coconut waste into valuable products, empowering women and men while promoting sustainable agriculture.
            </p>
            <div className="text-sm text-gray-700 space-y-2">
              <p>✓ Cocopeat for soilless farming</p>
              <p>✓ Coconut fiber for crafts</p>
              <p>✓ Cocopot for homes & offices</p>
              <p>✓ Briquette charcoal</p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm font-semibold text-green-700">
                Eliminating 80% of waste from landfills
              </p>
            </div>
          </div>

          {/* Coco-Connect */}
          <div 
            onClick={() => scrollToSection('cococonnect-section')}
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 border-2 border-blue-500 cursor-pointer"
          >
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="w-8 h-8 text-blue-700" />
            </div>
            <h3 className="text-2xl font-bold text-blue-700 mb-4">🛒 Coco-Connect</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              Our digital marketplace is a B2B2C platform that connects farmers, processors, suppliers, and buyers — creating a one-stop ecosystem for everything coconut.
            </p>
            <div className="text-sm text-gray-700 space-y-2">
              <p className="font-semibold text-blue-700">We Act as a Facilitator:</p>
              <p>✓ Connect farmers to suppliers</p>
              <p>✓ Link suppliers to farmers</p>
              <p>✓ Enable direct buyer-seller relationships</p>
              <p>✓ Provide verified business network</p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm font-semibold text-blue-700">
                5% Commission on successful transactions
              </p>
            </div>
          </div>

          {/* Coco DrinkEat */}
          <div 
            onClick={() => scrollToSection('cocodrinkeat-section')}
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 border-2 border-pink-500 cursor-pointer"
          >
            <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mb-6">
              <Calendar className="w-8 h-8 text-pink-700" />
            </div>
            <h3 className="text-2xl font-bold text-pink-700 mb-4">🥥 Coco DrinkEat</h3>
            <p className="text-gray-600 leading-relaxed mb-4">
              We bring the ultimate coconut experience to your events — fresh pre-cut coconuts ready to drink and eat on the spot!
            </p>
            <div className="text-sm text-gray-700 space-y-2">
              <p className="font-semibold text-pink-700">Event Services:</p>
              <p>✓ Fresh-cut coconuts at your venue</p>
              <p>✓ Drink coconut water on the spot</p>
              <p>✓ Eat fresh coconut meat</p>
              <p>✓ Custom branded serving stations</p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm font-semibold text-pink-700">
                Sustainable & memorable experience
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Coco-Tech Machines - Detailed Section */}
      <div id="cocotech-section" className="bg-gradient-to-br from-amber-50 to-amber-100 py-16 mt-20">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">🌿 Coco-Tech: Our Machines</h2>
              <p className="text-xl text-gray-700">
                Innovative, Patented Technology for Coconut Processing
              </p>
            </div>

            {/* Machines Grid */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Dehusking Machine */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center mb-4">
                  <div className="bg-amber-100 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl">⚙️</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Dehusking Machine</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  High-efficiency machine for removing coconut husk quickly and safely.
                </p>
                <div className="space-y-2 text-sm text-gray-700 mb-4">
                  <p>✓ <strong>Capacity:</strong> 500-900 coconuts per hour</p>
                  <p>✓ <strong>Operation:</strong> Single user, minimal training</p>
                  <p>✓ <strong>Safety:</strong> Automated to minimize injury risk</p>
                  <p>✓ <strong>Material:</strong> Locally sourced materials</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-amber-700">🏆 Patent Secured</p>
                  <p className="text-xs text-gray-600">Certificate No: NG/PT/NC/2024/14256</p>
                </div>
              </div>

              {/* Deshelling Machine */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center mb-4">
                  <div className="bg-amber-100 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl">🔧</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Deshelling Machine</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Industrial-grade machine for removing coconut kernel from shell cleanly and efficiently.
                </p>
                <div className="space-y-2 text-sm text-gray-700 mb-4">
                  <p>✓ <strong>Capacity:</strong> 240-400 coconuts per hour</p>
                  <p>✓ <strong>Operation:</strong> Dual-user operation</p>
                  <p>✓ <strong>Construction:</strong> Stainless steel cutting teeth</p>
                  <p>✓ <strong>Price:</strong> ₦1,000,000 per unit</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-amber-700">🏆 Patent Secured</p>
                  <p className="text-xs text-gray-600">Certificate No: NG/PT/NC/O/2024/14257</p>
                </div>
              </div>

              {/* Decorticator Machine */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center mb-4">
                  <div className="bg-amber-100 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl">🌾</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Decorticator Machine</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Specialized machine for separating cocopeat from coconut husk efficiently.
                </p>
                <div className="space-y-2 text-sm text-gray-700 mb-4">
                  <p>✓ <strong>Production:</strong> 200kg weekly capacity</p>
                  <p>✓ <strong>Output:</strong> High-quality cocopeat</p>
                  <p>✓ <strong>Application:</strong> Soilless & hydroponic farming</p>
                  <p>✓ <strong>Status:</strong> In production</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-green-700">✅ Operational & Producing</p>
                </div>
              </div>

              {/* Coconut Milk Extractor */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center mb-4">
                  <div className="bg-amber-100 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl">🥥</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Coconut Milk Extractor</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Premium milk extractors available in automatic and manual models.
                </p>
                <div className="space-y-2 text-sm text-gray-700 mb-4">
                  <p>✓ <strong>Models:</strong> Automatic & Manual options</p>
                  <p>✓ <strong>Construction:</strong> Pure stainless steel</p>
                  <p>✓ <strong>Operation:</strong> Hydraulic press system</p>
                  <p>✓ <strong>Maintenance:</strong> Low maintenance design</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-blue-700">📞 Available on Request</p>
                </div>
              </div>
            </div>

            {/* Why Choose Our Machines */}
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">Why Choose Coconoto Machines?</h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-4xl mb-3">🏆</div>
                  <h4 className="font-bold text-gray-900 mb-2">Patented Technology</h4>
                  <p className="text-sm text-gray-600">Federal Republic of Nigeria certified patents</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-3">🇳🇬</div>
                  <h4 className="font-bold text-gray-900 mb-2">Locally Made</h4>
                  <p className="text-sm text-gray-600">Built with locally available materials</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-3">⚡</div>
                  <h4 className="font-bold text-gray-900 mb-2">High Efficiency</h4>
                  <p className="text-sm text-gray-600">Up to 900 coconuts processed per hour</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-3">💰</div>
                  <h4 className="font-bold text-gray-900 mb-2">Cost-Effective</h4>
                  <p className="text-sm text-gray-600">Affordable pricing with quality guaranteed</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cococycle Hub - Detailed Section */}
      <div id="cococycle-section" className="bg-gradient-to-br from-green-50 to-green-100 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">🔄 Cococycle Hub: Waste to Value</h2>
              <p className="text-xl text-gray-700">
                Transforming 80% of Coconut Waste into Sustainable Products
              </p>
            </div>

            {/* Main Mission */}
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-8">
              <div className="text-center mb-8">
                <div className="inline-block bg-green-100 rounded-full p-4 mb-4">
                  <Recycle className="w-12 h-12 text-green-700" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission: Zero Waste Coconut Economy</h3>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Every year, millions of coconut husks and shells end up in landfills or are burned, releasing harmful emissions. 
                  At Cococycle Hub, we're closing the loop by converting this "waste" into valuable, sustainable products 
                  that benefit farmers, businesses, and the environment.
                </p>
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              {/* Cocopeat */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl">🌱</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Cocopeat</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Premium growing medium extracted from coconut husk for modern agriculture.
                </p>
                <div className="space-y-2 text-sm text-gray-700 mb-4">
                  <p>✓ <strong>Use:</strong> Soilless farming & hydroponics</p>
                  <p>✓ <strong>Properties:</strong> High water retention, excellent aeration</p>
                  <p>✓ <strong>Benefits:</strong> pH neutral, 100% organic, reusable</p>
                  <p>✓ <strong>Market:</strong> Urban farmers, greenhouses, commercial farms</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-green-700">♻️ Replacing Peat Moss - Saving Ecosystems</p>
                </div>
              </div>

              {/* Coconut Fiber */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl">🧵</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Coconut Fiber (Coir)</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Natural, durable fiber extracted from coconut husks for multiple applications.
                </p>
                <div className="space-y-2 text-sm text-gray-700 mb-4">
                  <p>✓ <strong>Use:</strong> Ropes, mats, brushes, upholstery</p>
                  <p>✓ <strong>Properties:</strong> Strong, resistant to saltwater, biodegradable</p>
                  <p>✓ <strong>Benefits:</strong> Sustainable alternative to synthetic fibers</p>
                  <p>✓ <strong>Market:</strong> Craft makers, manufacturers, exporters</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-green-700">🌍 Export-Ready Quality Standards</p>
                </div>
              </div>

              {/* Cocopot */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl">🪴</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Cocopot (Biodegradable Pots)</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  Eco-friendly planting pots made from compressed coconut husk.
                </p>
                <div className="space-y-2 text-sm text-gray-700 mb-4">
                  <p>✓ <strong>Use:</strong> Seedling starter, home gardening, office plants</p>
                  <p>✓ <strong>Properties:</strong> 100% biodegradable, naturally decomposes</p>
                  <p>✓ <strong>Benefits:</strong> Plant directly in soil - pot becomes fertilizer</p>
                  <p>✓ <strong>Market:</strong> Nurseries, home gardeners, landscapers</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-green-700">🌿 Zero Plastic - Pure Nature</p>
                </div>
              </div>

              {/* Briquette Charcoal */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <div className="flex items-center mb-4">
                  <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl">🔥</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Briquette Charcoal</h3>
                </div>
                <p className="text-gray-600 mb-4">
                  High-quality charcoal briquettes from coconut shells - clean and efficient fuel.
                </p>
                <div className="space-y-2 text-sm text-gray-700 mb-4">
                  <p>✓ <strong>Use:</strong> Cooking, heating, BBQ grilling</p>
                  <p>✓ <strong>Properties:</strong> Long burning time, high heat output, low smoke</p>
                  <p>✓ <strong>Benefits:</strong> Cleaner than wood charcoal, no chemicals</p>
                  <p>✓ <strong>Market:</strong> Restaurants, households, export markets</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm font-semibold text-green-700">🔥 Premium Export-Grade Quality</p>
                </div>
              </div>
            </div>

            {/* Social Impact Section */}
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-8">
              <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">Empowering Communities</h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-5xl mb-4">👩‍🌾</div>
                  <h4 className="font-bold text-gray-900 mb-2">Women Empowerment</h4>
                  <p className="text-sm text-gray-600">
                    Training and employing women in waste collection, processing, and product creation
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-5xl mb-4">💼</div>
                  <h4 className="font-bold text-gray-900 mb-2">Job Creation</h4>
                  <p className="text-sm text-gray-600">
                    Creating sustainable livelihoods for rural communities through circular economy
                  </p>
                </div>
                <div className="text-center">
                  <div className="text-5xl mb-4">🌍</div>
                  <h4 className="font-bold text-gray-900 mb-2">Environmental Impact</h4>
                  <p className="text-sm text-gray-600">
                    Diverting 80% of coconut waste from landfills and reducing carbon emissions
                  </p>
                </div>
              </div>
            </div>

            {/* Why Cococycle Hub */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl shadow-xl p-8 md:p-12 text-white">
              <h3 className="text-2xl font-bold text-center mb-8">Why Partner with Cococycle Hub?</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-4xl mb-3">♻️</div>
                  <h4 className="font-bold mb-2">100% Waste Utilization</h4>
                  <p className="text-sm text-green-100">Every part of the coconut has value</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-3">🌱</div>
                  <h4 className="font-bold mb-2">Organic & Sustainable</h4>
                  <p className="text-sm text-green-100">Chemical-free, eco-friendly products</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-3">📈</div>
                  <h4 className="font-bold mb-2">Growing Market</h4>
                  <p className="text-sm text-green-100">Increasing demand for sustainable alternatives</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl mb-3">🤝</div>
                  <h4 className="font-bold mb-2">Social Enterprise</h4>
                  <p className="text-sm text-green-100">Profit with purpose and community impact</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coco-Connect Marketplace - Detailed Section */}
      <div id="cococonnect-section" className="bg-gradient-to-br from-blue-50 to-blue-100 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">🛒 Coco-Connect Marketplace</h2>
              <p className="text-xl text-gray-700">
                A Digital B2B2C Platform Built for the Coconut Value Chain
              </p>
            </div>

            {/* How It Works */}
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-8">
              <h3 className="text-2xl font-bold text-blue-700 mb-6 text-center">How We Facilitate Connections</h3>
              
              <div className="grid md:grid-cols-3 gap-8">
                {/* Farmers */}
                <div className="text-center">
                  <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">🌾</span>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Farmers</h4>
                  <p className="text-gray-600 text-sm">
                    Access verified suppliers and buyers. Sell your coconuts directly without middlemen.
                  </p>
                </div>

                {/* Coconoto as Facilitator */}
                <div className="text-center relative">
                  <div className="hidden md:block absolute top-10 left-0 right-0 border-t-2 border-dashed border-blue-300"></div>
                  <div className="bg-blue-600 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
                    <span className="text-4xl">🤝</span>
                  </div>
                  <h4 className="text-lg font-bold text-blue-700 mb-2">Coconoto</h4>
                  <p className="text-blue-600 text-sm font-semibold">
                    We Connect & Facilitate
                  </p>
                  <p className="text-gray-600 text-xs mt-2">
                    5% commission on successful transactions
                  </p>
                </div>

                {/* Suppliers/Buyers */}
                <div className="text-center">
                  <div className="bg-orange-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-4xl">🏭</span>
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 mb-2">Suppliers & Processors</h4>
                  <p className="text-gray-600 text-sm">
                    Find reliable farmers and expand your coconut supply chain network.
                  </p>
                </div>
              </div>
            </div>

            {/* Key Features */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h4 className="text-xl font-bold text-gray-900 mb-4">For Farmers</h4>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Connect directly with verified suppliers and processors</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Get fair prices for your coconut products</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Access processing services and equipment</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-600 mr-2">✓</span>
                    <span>Expand your market reach across Nigeria and beyond</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <h4 className="text-xl font-bold text-gray-900 mb-4">For Suppliers & Buyers</h4>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Access a network of verified coconut farmers</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Source quality coconuts and coconut products</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Streamline your supply chain operations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-blue-600 mr-2">✓</span>
                    <span>Reduce transaction costs and time</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Value Proposition */}
            <div className="bg-blue-600 rounded-xl shadow-lg p-8 mt-8 text-white text-center">
              <h4 className="text-2xl font-bold mb-4">One Platform, Endless Connections</h4>
              <p className="text-blue-100 text-lg mb-6">
                We facilitate transparent, efficient, and profitable transactions across the entire coconut value chain — from farm to factory to market.
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                <div>
                  <div className="text-3xl font-bold">B2B</div>
                  <div className="text-blue-200">Business to Business</div>
                </div>
                <div className="text-3xl">+</div>
                <div>
                  <div className="text-3xl font-bold">B2C</div>
                  <div className="text-blue-200">Business to Consumer</div>
                </div>
                <div className="text-3xl">=</div>
                <div>
                  <div className="text-3xl font-bold">B2B2C</div>
                  <div className="text-blue-200">Complete Ecosystem</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Coco DrinkEat - Event Experience Section */}
      <div id="cocodrinkeat-section" className="bg-gradient-to-br from-pink-50 to-rose-100 py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">🥥 Coco DrinkEat: Event Experience</h2>
              <p className="text-xl text-gray-700">
                Bring the Fresh Coconut Experience to Your Events
              </p>
            </div>

            {/* Main Description */}
            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 mb-8">
              <div className="text-center mb-8">
                <div className="text-6xl mb-4">🥥🎉</div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">We Come to You!</h3>
                <p className="text-xl text-gray-700 leading-relaxed">
                  Transform your event with our unique coconut experience — we bring fresh, pre-cut coconuts directly to your venue where guests can drink refreshing coconut water and enjoy delicious coconut meat on the spot.
                </p>
              </div>

              {/* How It Works */}
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                <div className="text-center p-6 bg-pink-50 rounded-xl">
                  <div className="text-4xl mb-3">🔪</div>
                  <h4 className="font-bold text-gray-900 mb-2">1. We Prepare</h4>
                  <p className="text-sm text-gray-600">Fresh coconuts pre-cut and ready to serve at your location</p>
                </div>
                <div className="text-center p-6 bg-pink-50 rounded-xl">
                  <div className="text-4xl mb-3">🥤</div>
                  <h4 className="font-bold text-gray-900 mb-2">2. You Drink</h4>
                  <p className="text-sm text-gray-600">Guests enjoy fresh, natural coconut water straight from the coconut</p>
                </div>
                <div className="text-center p-6 bg-pink-50 rounded-xl">
                  <div className="text-4xl mb-3">🍴</div>
                  <h4 className="font-bold text-gray-900 mb-2">3. You Eat</h4>
                  <p className="text-sm text-gray-600">Scoop and savor the tender coconut meat inside</p>
                </div>
              </div>
            </div>

            {/* Features & Perfect For */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* What We Offer */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h4 className="text-2xl font-bold text-pink-700 mb-6">What We Offer</h4>
                <ul className="space-y-4 text-gray-700">
                  <li className="flex items-start">
                    <span className="text-pink-600 mr-3 text-xl">✓</span>
                    <div>
                      <p className="font-semibold">Fresh-Cut Coconuts</p>
                      <p className="text-sm text-gray-600">Pre-cut and ready to serve immediately</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-600 mr-3 text-xl">✓</span>
                    <div>
                      <p className="font-semibold">Custom Serving Stations</p>
                      <p className="text-sm text-gray-600">Branded setups that match your event theme</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-600 mr-3 text-xl">✓</span>
                    <div>
                      <p className="font-semibold">Professional Service Staff</p>
                      <p className="text-sm text-gray-600">Trained team to serve your guests</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="text-pink-600 mr-3 text-xl">✓</span>
                    <div>
                      <p className="font-semibold">Eco-Friendly Presentation</p>
                      <p className="text-sm text-gray-600">Sustainable and zero-waste service</p>
                    </div>
                  </li>
                </ul>
              </div>

              {/* Perfect For */}
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h4 className="text-2xl font-bold text-pink-700 mb-6">Perfect For</h4>
                <div className="space-y-4">
                  <div className="flex items-center p-3 bg-pink-50 rounded-lg">
                    <span className="text-2xl mr-3">🎂</span>
                    <div>
                      <p className="font-semibold text-gray-900">Weddings & Celebrations</p>
                      <p className="text-xs text-gray-600">Make your special day unique</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-pink-50 rounded-lg">
                    <span className="text-2xl mr-3">🏢</span>
                    <div>
                      <p className="font-semibold text-gray-900">Corporate Events</p>
                      <p className="text-xs text-gray-600">Impress clients and employees</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-pink-50 rounded-lg">
                    <span className="text-2xl mr-3">🎪</span>
                    <div>
                      <p className="font-semibold text-gray-900">Festivals & Outdoor Events</p>
                      <p className="text-xs text-gray-600">Refreshing natural beverage</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-pink-50 rounded-lg">
                    <span className="text-2xl mr-3">🎉</span>
                    <div>
                      <p className="font-semibold text-gray-900">Private Parties</p>
                      <p className="text-xs text-gray-600">Create memorable experiences</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Why Choose Us */}
            <div className="bg-gradient-to-r from-pink-600 to-rose-600 rounded-xl shadow-lg p-8 mt-8 text-white text-center">
              <h4 className="text-2xl font-bold mb-4">Why Choose Coco DrinkEat?</h4>
              <div className="grid md:grid-cols-4 gap-6 mt-6">
                <div>
                  <div className="text-3xl mb-2">🌿</div>
                  <p className="font-semibold">100% Natural</p>
                  <p className="text-sm text-pink-100">No additives or preservatives</p>
                </div>
                <div>
                  <div className="text-3xl mb-2">♻️</div>
                  <p className="font-semibold">Eco-Friendly</p>
                  <p className="text-sm text-pink-100">Zero-waste service model</p>
                </div>
                <div>
                  <div className="text-3xl mb-2">✨</div>
                  <p className="font-semibold">Unique</p>
                  <p className="text-sm text-pink-100">Memorable experience for guests</p>
                </div>
                <div>
                  <div className="text-3xl mb-2">🏆</div>
                  <p className="font-semibold">Professional</p>
                  <p className="text-sm text-pink-100">Experienced event staff</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Market */}
      <div className="container mx-auto px-6 mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Market</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Serving diverse industries across Nigeria and beyond with innovative coconut solutions
            </p>
          </div>

          {/* Market Stats */}
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl shadow-xl p-8 mb-12 text-white">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold mb-2">267,000</div>
                <p className="text-green-100">Metric Tonnes Consumed Annually</p>
                <p className="text-sm text-green-200 mt-1">Nigeria's coconut consumption</p>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">125,490</div>
                <p className="text-green-100">Tonnes of Waste Annually</p>
                <p className="text-sm text-green-200 mt-1">47% husk and shells</p>
              </div>
              <div>
                <div className="text-4xl font-bold mb-2">$12.88B</div>
                <p className="text-green-100">Market Value (USD)</p>
                <p className="text-sm text-green-200 mt-1">Industrial processing potential</p>
              </div>
            </div>
          </div>

          {/* Market Segments */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {/* Climate Farmers */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🌱</span>
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-3 text-center">Climate Farmers</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Soilless farming</p>
                <p>• Hydroponics systems</p>
                <p>• Horticulturists</p>
                <p>• Commercial greenhouses</p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-green-700 font-semibold text-center">Using our Cocopeat products</p>
              </div>
            </div>

            {/* Processors */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🏭</span>
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-3 text-center">Processors</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Coconut oil producers</p>
                <p>• Milk & beverage makers</p>
                <p>• Flakes & flour factories</p>
                <p>• Industrial processing</p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-blue-700 font-semibold text-center">Using our machines & services</p>
              </div>
            </div>

            {/* Homes & Offices */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🏡</span>
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-3 text-center">Homes & Offices</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Indoor plant lovers</p>
                <p>• Office landscaping</p>
                <p>• Garden enthusiasts</p>
                <p>• Decorative planters</p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-purple-700 font-semibold text-center">Using Cocopot & Fiber products</p>
              </div>
            </div>

            {/* Energy Users */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 transform hover:-translate-y-2">
              <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">🔥</span>
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-3 text-center">Energy Users</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Households</p>
                <p>• Restaurants & eateries</p>
                <p>• Small businesses</p>
                <p>• Eco-conscious consumers</p>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-orange-700 font-semibold text-center">Using Briquette Charcoal</p>
              </div>
            </div>
          </div>

          {/* Additional Market Info */}
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Why Our Market Is Growing</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">�</span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Rising Demand</h4>
                <p className="text-sm text-gray-600">
                  Increasing awareness of sustainable agriculture and eco-friendly products
                </p>
              </div>
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🌍</span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Climate Action</h4>
                <p className="text-sm text-gray-600">
                  Businesses and individuals choosing sustainable alternatives to combat climate change
                </p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">💡</span>
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Innovation</h4>
                <p className="text-sm text-gray-600">
                  Technology-driven solutions making coconut products more accessible and affordable
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Impact */}
      <div className="bg-green-700 text-white py-16 mt-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold mb-8 text-center">Our Social Impact</h2>
          <div className="max-w-5xl mx-auto">
            <p className="text-xl text-green-50 leading-relaxed mb-8 text-center">
              Coconoto aligns with the UN Sustainable Development Goals (SDGs 5, 8 & 12), promoting gender equality, decent work, and responsible production.
            </p>
            
            {/* SDG Cards */}
            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                <div className="text-4xl font-bold text-green-300 mb-2">SDG 5</div>
                <h3 className="text-xl font-bold text-white mb-3">Gender Equality</h3>
                <ul className="text-green-100 text-sm space-y-2">
                  <li>• Employ more women</li>
                  <li>• Integrate women into value chain</li>
                  <li>• Improve performance of men in the industry</li>
                </ul>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                <div className="text-4xl font-bold text-green-300 mb-2">SDG 8</div>
                <h3 className="text-xl font-bold text-white mb-3">Decent Work</h3>
                <ul className="text-green-100 text-sm space-y-2">
                  <li>• Create more decent jobs</li>
                  <li>• Contribute to coconut industry growth</li>
                  <li>• Access to digital marketplace</li>
                </ul>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl">
                <div className="text-4xl font-bold text-green-300 mb-2">SDG 12</div>
                <h3 className="text-xl font-bold text-white mb-3">Responsible Production</h3>
                <ul className="text-green-100 text-sm space-y-2">
                  <li>• Improve production to reduce waste</li>
                  <li>• Promote circularity</li>
                  <li>• Increase revenue by 20%</li>
                </ul>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mt-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-green-300 mb-2">80%</div>
                <p className="text-green-100">Coconut waste elimination target</p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-green-300 mb-2">500-900</div>
                <p className="text-green-100">Coconuts per hour processing capacity</p>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-green-300 mb-2">₦430M</div>
                <p className="text-green-100">Projected revenue by 2030</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Story */}
      <div className="container mx-auto px-6 mt-20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Story</h2>
            <div className="w-24 h-1 bg-green-600 mx-auto mb-6"></div>
          </div>
          
          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl shadow-xl p-8 md:p-12">
            <div className="space-y-6 text-gray-700 text-lg leading-relaxed">
              <p>
                Born out of the need to tackle <span className="font-semibold text-green-700">waste and inefficiency in the coconut industry</span>, Coconoto began as a vision to merge sustainability with technology. What started as a simple observation — seeing tons of coconut waste ending up in landfills and releasing harmful carbon — became a mission to transform the entire coconut value chain.
              </p>
              <p>
                Starting from <span className="font-semibold text-green-700">Badagry, Nigeria</span>, we set out to prove that coconut waste isn't waste at all — it's an untapped resource waiting to be transformed. From our first decorticator machine producing 200kg of cocopeat weekly, to securing patents on our innovative dehusking and deshelling technology, we've been committed to <span className="font-semibold text-green-700">building solutions that empower farmers, create jobs, and protect our environment</span>.
              </p>
              <p>
                Today, Coconoto is <span className="font-semibold text-green-700">expanding across Africa</span>, bringing our technology, marketplace, and sustainable products to communities that need them most. We've gone from processing a few hundred coconuts to handling 500-900 coconuts per hour, from a small plot of land in Badagry to partnerships with farmers across Nigeria, and from a startup vision to a <span className="font-semibold text-green-700">circular economy model</span> that's making real impact.
              </p>
              <div className="bg-white rounded-lg p-6 mt-6 border-l-4 border-green-600">
                <p className="text-gray-800 italic">
                  "Our journey is just beginning. Every coconut we process, every farmer we empower, and every ton of waste we eliminate brings us closer to our vision — a sustainable, technology-enabled coconut economy for all of Africa."
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Our Team */}
      <div className="container mx-auto px-6 mt-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Team</h2>
            <div className="w-24 h-1 bg-green-600 mx-auto mb-6"></div>
            <p className="text-xl text-gray-700 leading-relaxed max-w-4xl mx-auto mb-6">
              Led by a diverse team with over <span className="font-semibold text-green-700">25 years of combined experience</span> across engineering, software development, finance, marketing, and operations — our team brings together <span className="font-semibold text-green-700">passion, innovation, and expertise</span> to revolutionize the coconut industry.
            </p>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              From mechanical engineers designing cutting-edge machines to software developers building digital marketplaces, from financial experts managing sustainable growth to marketing professionals amplifying our impact — we are united by one mission: <span className="italic text-green-700">transforming coconut waste into wealth while empowering communities</span>.
            </p>
          </div>

          {/* Team Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Jacob O. Abiodun - Founder/CEO */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-green-600 to-green-700 h-48 flex items-center justify-center">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center">
                  <span className="text-5xl font-bold text-green-700">JA</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Jacob O. Abiodun</h3>
                <p className="text-green-600 font-semibold mb-3">Founder/CEO</p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Mechanical Engineer, Project Manager, and Software Developer bringing innovation to the coconut industry.
                </p>
              </div>
            </div>

            {/* Enoch Bamigboye */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 h-48 flex items-center justify-center">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center">
                  <span className="text-5xl font-bold text-blue-700">EB</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Enoch Bamigboye</h3>
                <p className="text-green-600 font-semibold mb-3">Software Engineer</p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Expert in building scalable software solutions and digital platforms for the agri-tech sector.
                </p>
              </div>
            </div>

            {/* Rebecca Olaniyan */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-purple-600 to-purple-700 h-48 flex items-center justify-center">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center">
                  <span className="text-5xl font-bold text-purple-700">RO</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Rebecca Olaniyan</h3>
                <p className="text-green-600 font-semibold mb-3">Finance Manager</p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  ICAN, ACA certified professional managing financial strategy and operations.
                </p>
              </div>
            </div>

            {/* Taiwo Omitoyin */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-orange-600 to-orange-700 h-48 flex items-center justify-center">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center">
                  <span className="text-5xl font-bold text-orange-700">TO</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Taiwo Omitoyin</h3>
                <p className="text-green-600 font-semibold mb-3">Sales & Marketing</p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Content creation specialist and videographer driving brand visibility and engagement.
                </p>
              </div>
            </div>

            {/* Jamiu Adetona */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition duration-300 transform hover:-translate-y-2">
              <div className="bg-gradient-to-br from-teal-600 to-teal-700 h-48 flex items-center justify-center">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center">
                  <span className="text-5xl font-bold text-teal-700">JA</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">Jamiu Adetona</h3>
                <p className="text-green-600 font-semibold mb-3">Project Manager</p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Industrial Engineer specializing in 3D modelling and fabrication of innovative machinery.
                </p>
              </div>
            </div>

            {/* Add Team Member Placeholder */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-dashed border-gray-300 hover:border-green-500 transition duration-300">
              <div className="bg-gradient-to-br from-gray-200 to-gray-300 h-48 flex items-center justify-center">
                <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center">
                  <span className="text-5xl text-gray-400">+</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-600 mb-1">Join Our Team</h3>
                <p className="text-gray-500 font-semibold mb-3">We're Growing</p>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Passionate about sustainability and innovation? We're always looking for talented individuals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="container mx-auto px-6 mt-20 mb-12">
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-12 text-center text-white shadow-2xl">
          <h2 className="text-4xl font-bold mb-4">Join Us in Building the Future</h2>
          <p className="text-xl text-green-50 max-w-2xl mx-auto mb-8 leading-relaxed">
            Join us in building the future of the coconut economy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setIsWaitlistModalOpen(true)}
              className="bg-white text-green-700 px-8 py-4 rounded-lg text-lg font-semibold shadow-lg hover:bg-green-50 transition transform hover:scale-105"
            >
              Join Our Waitlist
            </button>
            <a
              href="/"
              className="bg-green-800 text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-lg hover:bg-green-900 transition transform hover:scale-105"
            >
              Learn More
            </a>
          </div>
        </div>
      </div>

      <WaitlistModal
        isOpen={isWaitlistModalOpen}
        onClose={() => setIsWaitlistModalOpen(false)}
      />
    </div>
  );
}
