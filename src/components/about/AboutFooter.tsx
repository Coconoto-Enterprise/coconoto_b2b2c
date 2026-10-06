import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaLinkedin, FaWhatsapp, FaEnvelope } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import Logo from '../../assets/CoconotoGreenLogoMark.png';
import footerBg from '../../assets/fotterimage.png';

export default function AboutFooter() {
  return (
    // Everything on this footer is pure white (`#fff`) — the owner asked for it
    // explicitly, because the old `text-gray-400` (#9CA3AF) washed out against the
    // `#1f1611` background once the soil photo behind it is at 25% opacity.
    //
    // Because the base colour is now white, the links can no longer signal hover by
    // *becoming* white — so they dim to 70% instead. Without this the whole footer
    // would be inert to the pointer.
    <footer className="relative bg-[#1f1611] text-white pt-12 pb-8 sm:pt-14 overflow-hidden">
      {/* Subtle soil background image */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-25 bg-cover bg-center pointer-events-none"
        style={{ backgroundImage: `url(${footerBg})` }}
      />
      <div className="relative container mx-auto px-4 sm:px-6">
        {/* Two columns on phones: the brand block spans the full width and the
            four link groups pair up. As a single column this stacked five
            blocks with 32px between each and ran to well over a screen. */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-1">
            <Link to="/" onClick={() => window.scrollTo(0, 0)} className="inline-flex items-center mb-4">
              {/* `CoconotoGreenLogoMark.png` is a 2170 × 725 wordmark — 3.04:1, roughly
                half as wide per unit height as the old 760 × 121 (6.28:1) brown one
                it replaced. At the old `h-8` it would have rendered only ~97px wide
                and looked lost in the brand column, so the height goes up to keep a
                comparable footprint (~146px). Height-only, never a fixed `w-*`: the
                artwork must keep its own aspect or it letterboxes. */}
            <img src={Logo} alt="Coconoto" className="h-12" />
            </Link>
            <p className="text-white text-sm">
              Smart Agritech for the coconut value chain.
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-4">Solutions</h3>
            <ul className="space-y-2 text-white text-sm">
              <li><Link to="/cococycle-hub" onClick={() => window.scrollTo(0, 0)} className="hover:opacity-70">Cocycle Hub</Link></li>
              <li><Link to="/cocotech" onClick={() => window.scrollTo(0, 0)} className="hover:opacity-70">Coco-Tech</Link></li>
              <li><Link to="/cococonnect" onClick={() => window.scrollTo(0, 0)} className="hover:opacity-70">Coco-Connect</Link></li>
              <li><Link to="/contact" onClick={() => window.scrollTo(0, 0)} className="hover:opacity-70">Coco Eat &amp; Drink</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">About Us</h3>
            <ul className="space-y-2 text-white text-sm">
              <li><Link to="/about" onClick={() => window.scrollTo(0, 0)} className="hover:opacity-70">About Coconoto</Link></li>
              <li><Link to="/blog" onClick={() => window.scrollTo(0, 0)} className="hover:opacity-70">Blog</Link></li>
              <li><Link to="/contact" onClick={() => window.scrollTo(0, 0)} className="hover:opacity-70">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Products</h3>
            <ul className="space-y-2 text-white text-sm">
              <li><Link to="/contact" onClick={() => window.scrollTo(0, 0)} className="hover:opacity-70">Book Service</Link></li>
              <li><Link to="/cocotech" onClick={() => window.scrollTo(0, 0)} className="hover:opacity-70">Order Machine</Link></li>
              <li><Link to="/cococycle-hub" onClick={() => window.scrollTo(0, 0)} className="hover:opacity-70">Order Product</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Contact us</h3>
            <ul className="space-y-2 text-white text-sm">
              <li>
                <a href="mailto:info@coconoto.africa" className="hover:opacity-70 break-all">
                  info@coconoto.africa
                </a>
              </li>
              <li>
                No 67, Cele estate, Mowo kekere, Ikorodu, Lagos, Nigeria
              </li>
              <li>
                <a href="tel:+2348137775689" className="hover:opacity-70">
                  +234 813 777 5689
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-white">
          <div className="flex gap-6">
            <Link to="/terms-of-service" onClick={() => window.scrollTo(0, 0)} className="hover:opacity-70">Terms</Link>
            <Link to="/privacy-policy" onClick={() => window.scrollTo(0, 0)} className="hover:opacity-70">Privacy</Link>
            <Link to="/cookie-policy" onClick={() => window.scrollTo(0, 0)} className="hover:opacity-70">Security</Link>
          </div>
          <p className="text-center">2026 - Coconoto. All rights reserved.</p>
          {/* react-icons draw with `fill="currentColor"`, so `text-white` here is
              what makes every glyph pure white. Stated on the container rather than
              left to inherit from the row above, because the icons are the one part
              of the footer that reads as a distinct element. */}
          <div className="flex gap-4 text-white">
            <a
              href="https://m.facebook.com/p/Coconoto-100092422418297/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="hover:opacity-70"
            >
              <FaFacebook className="h-5 w-5" />
            </a>
            <a
              href="https://www.instagram.com/_coconoto?igsh=MTNuZXh1dGF1dTd0dw=="
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="hover:opacity-70"
            >
              <FaInstagram className="h-5 w-5" />
            </a>
            <a
              href="https://www.linkedin.com/company/coconoto/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="hover:opacity-70"
            >
              <FaLinkedin className="h-5 w-5" />
            </a>
            <a href="https://wa.me/qr/CTOTUF7JCEUFE1" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="hover:opacity-70">
              <FaWhatsapp className="h-5 w-5" />
            </a>
            <a href="https://x.com/CoconotoAfrica" target="_blank" rel="noopener noreferrer" aria-label="X" className="hover:opacity-70">
              <FaXTwitter className="h-5 w-5" />
            </a>
            <a href="mailto:info@coconoto.africa" aria-label="Email" className="hover:opacity-70">
              <FaEnvelope className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}