import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Palmtree } from 'lucide-react';
import { FaFacebook, FaInstagram, FaLinkedin, FaWhatsapp, FaEnvelope } from 'react-icons/fa';
import { WaitlistModal } from './WaitlistModal';
import { BookEventModal } from './BookEventModal';

export default function Footer() {
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);
  const [isBookEventModalOpen, setIsBookEventModalOpen] = useState(false);

  return (
    <>
    <footer className="bg-gray-900 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img src="/Icon_green.png" alt="o" className="h-8 inline-block mx-[-6px] mt-[6px] ms-[1.5px] mr-[1.5px]" />
              <span className="text-4xl md:text-2xl font-bold">Coconoto</span>
            </div>
            <p className="text-gray-400 mb-4">
              Transforming B2B trade through innovation and trust.
            </p>
            <div className="flex space-x-4 md:space-x-2 flex-wrap">
              <a href="https://m.facebook.com/p/Coconoto-100092422418297/" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-gray-600 transition-colors" aria-label="Facebook">
                <FaFacebook className="h-6 w-6" />
              </a>
              <a href="https://www.instagram.com/_coconoto?igsh=MTNuZXh1dGF1dTd0dw==" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-gray-600 transition-colors" aria-label="Instagram">
                <FaInstagram className="h-6 w-6" />
              </a>
              <a href="https://www.linkedin.com/company/coconoto/" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-gray-600 transition-colors" aria-label="LinkedIn">
                <FaLinkedin className="h-6 w-6" />
              </a>
              <a href="https://wa.me/qr/CTOTUF7JCEUFE1" target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-gray-600 transition-colors" aria-label="WhatsApp">
                <FaWhatsapp className="h-6 w-6" />
              </a>
              <a href="mailto:coconotoenterprise@gmail.com" className="text-green-600 hover:text-gray-600 transition-colors" aria-label="Email">
                <FaEnvelope className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Solutions</h3>
            <ul className="space-y-2">
              <li><Link to="/product" onClick={() => window.scrollTo(0, 0)} className="text-gray-400 hover:text-white">Cococycle Hub</Link></li>
              <li><Link to="/services" onClick={() => window.scrollTo(0, 0)} className="text-gray-400 hover:text-white">Coco-Tech</Link></li>
              <li><button onClick={() => setIsWaitlistModalOpen(true)} className="text-gray-400 hover:text-white text-left">Coco-Connect</button></li>
              <li><button onClick={() => setIsBookEventModalOpen(true)} className="text-gray-400 hover:text-white text-left">Coco DrinkEat</button></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">About Us</h3>
            <ul className="space-y-2">
              <li><Link to="/about" onClick={() => window.scrollTo(0, 0)} className="text-gray-400 hover:text-white">About Coconoto</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
              <li><Link to="/contact" onClick={() => window.scrollTo(0, 0)} className="text-gray-400 hover:text-white">Contact Us</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-4">Get Started</h3>
            <ul className="space-y-2">
              <li><Link to="/contact" onClick={() => window.scrollTo(0, 0)} className="text-gray-400 hover:text-white">Contact Us</Link></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Book Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Order Machine</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Order Product</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white">Learn More</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 space-y-4 md:space-y-0 px-4 md:px-8">
            <div className="flex flex-wrap justify-center md:justify-start gap-6 md:gap-12">
              <Link to="/terms-of-service" onClick={() => window.scrollTo(0, 0)} className="hover:text-white transition-colors">Terms of Service</Link>
              <Link to="/privacy-policy" onClick={() => window.scrollTo(0, 0)} className="hover:text-white transition-colors">Privacy Policy</Link>
            </div>
            <p className="text-center md:text-right">© {new Date().getFullYear()} Coconoto. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
    
    <WaitlistModal
      isOpen={isWaitlistModalOpen}
      onClose={() => setIsWaitlistModalOpen(false)}
    />
    <BookEventModal
      isOpen={isBookEventModalOpen}
      onClose={() => setIsBookEventModalOpen(false)}
    />
    </>
  );
}
