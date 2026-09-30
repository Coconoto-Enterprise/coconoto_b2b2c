import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaLinkedin, FaWhatsapp, FaEnvelope } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import Logo from '../../assets/Logo_1.png';
import footerBg from '../../assets/fotterimage.png';

export default function AboutFooter() {
  return (
    <footer className="relative bg-[#1f1611] text-white pt-14 pb-8 overflow-hidden">
      {/* Subtle soil background image */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-25 bg-cover bg-center pointer-events-none"
        style={{ backgroundImage: `url(${footerBg})` }}
      />
      <div className="relative container mx-auto px-4 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <Link to="/" onClick={() => window.scrollTo(0, 0)} className="inline-flex items-center mb-4">
              <img src={Logo} alt="Coconoto" className="h-8" />
            </Link>
            <p className="text-gray-400 text-sm">
              Smart Agritech for the coconut value chain.
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-4">Solutions</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/product" onClick={() => window.scrollTo(0, 0)} className="hover:text-white">Cocycle Hub</Link></li>
              <li><Link to="/services" onClick={() => window.scrollTo(0, 0)} className="hover:text-white">Coco-Tech</Link></li>
              <li><Link to="/marketplace" onClick={() => window.scrollTo(0, 0)} className="hover:text-white">Coco-Connect</Link></li>
              <li><Link to="/contact" onClick={() => window.scrollTo(0, 0)} className="hover:text-white">Coco Eat &amp; Drink</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">About Us</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/about" onClick={() => window.scrollTo(0, 0)} className="hover:text-white">About Coconoto</Link></li>
              <li><Link to="/blog" onClick={() => window.scrollTo(0, 0)} className="hover:text-white">Blog</Link></li>
              <li><Link to="/contact" onClick={() => window.scrollTo(0, 0)} className="hover:text-white">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Products</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/contact" onClick={() => window.scrollTo(0, 0)} className="hover:text-white">Book Service</Link></li>
              <li><Link to="/services" onClick={() => window.scrollTo(0, 0)} className="hover:text-white">Order Machine</Link></li>
              <li><Link to="/product" onClick={() => window.scrollTo(0, 0)} className="hover:text-white">Order Product</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Contact us</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <a href="mailto:info@coconoto.africa" className="hover:text-white break-all">
                  info@coconoto.africa
                </a>
              </li>
              <li>
                No 67, Cele estate, Mowo kekere, Ikorodu, Lagos, Nigeria
              </li>
              <li>
                <a href="tel:+2348137775689" className="hover:text-white">
                  +234 813 777 5689
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <div className="flex gap-6">
            <Link to="/terms-of-service" onClick={() => window.scrollTo(0, 0)} className="hover:text-white">Terms</Link>
            <Link to="/privacy-policy" onClick={() => window.scrollTo(0, 0)} className="hover:text-white">Privacy</Link>
            <Link to="/cookie-policy" onClick={() => window.scrollTo(0, 0)} className="hover:text-white">Security</Link>
          </div>
          <p className="text-center">2026 - Coconoto. All rights reserved.</p>
          <div className="flex gap-4">
            <a
              href="https://m.facebook.com/p/Coconoto-100092422418297/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:text-white"
            >
              <FaFacebook className="h-5 w-5" />
            </a>
            <a
              href="https://www.instagram.com/_coconoto?igsh=MTNuZXh1dGF1dTd0dw=="
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:text-white"
            >
              <FaInstagram className="h-5 w-5" />
            </a>
            <a
              href="https://www.linkedin.com/company/coconoto/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:text-white"
            >
              <FaLinkedin className="h-5 w-5" />
            </a>
            <a href="https://wa.me/qr/CTOTUF7JCEUFE1" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="hover:text-white">
              <FaWhatsapp className="h-5 w-5" />
            </a>
            <a href="https://x.com/CoconotoAfrica" target="_blank" rel="noopener noreferrer" aria-label="X" className="hover:text-white">
              <FaXTwitter className="h-5 w-5" />
            </a>
            <a href="mailto:info@coconoto.africa" aria-label="Email" className="hover:text-white">
              <FaEnvelope className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}