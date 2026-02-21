import React from 'react';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter, Github } from 'lucide-react';

function Footer() {
  return (
    <footer className="bg-gradient-to-tr from-blue-950 via-black to-blue-950 text-gray-300 font-sans">
      {/* 1. Newsletter & Branding Section */}
      <div className="max-w-7xl mx-auto px-4 pt-16 pb-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-b border-white/10 pb-12">
          <div>
            <h2 className="text-3xl font-serif font-bold text-white uppercase tracking-tighter mb-2">
              Lobuy<span className="text-blue-500">.</span>
            </h2>
            <p className="text-sm text-gray-400 max-w-sm">
              Your destination for premium products and seamless shopping. Elevate your lifestyle with our curated collections.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 md:justify-end">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-white/5 border border-white/20 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all w-full sm:w-64"
            />
            <button className="bg-white text-black font-bold py-2.5 px-6 rounded-lg hover:bg-blue-500 hover:text-white transition-all text-sm uppercase">
              Subscribe
            </button>
          </div>
        </div>

        {/* 2. Main Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 py-12">
          {/* Column 1 */}
          <div>
            <h3 className="text-white font-bold uppercase text-xs tracking-widest mb-6">Shopping</h3>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">New Arrivals</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Best Sellers</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Offers & Discounts</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Store Locator</a></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="text-white font-bold uppercase text-xs tracking-widest mb-6">Company</h3>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sustainability</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Newsroom</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="text-white font-bold uppercase text-xs tracking-widest mb-6">Customer Care</h3>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Track Your Order</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Returns & Exchanges</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Shipping Info</a></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h3 className="text-white font-bold uppercase text-xs tracking-widest mb-6">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-blue-500" />
                <span>support@lobuy.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-blue-500" />
                <span>+91 8606990014</span>
              </li>
              <li className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span>india, kerala</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 3. Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-gray-500">
            © 2026 LOBUY Inc. All rights reserved.
          </p>
          
          {/* Social Icons */}
          <div className="flex gap-6">
            <a href="#" className="hover:text-blue-500 transition-colors"><Facebook className="w-5 h-5" /></a>
            <a href="#" className="hover:text-blue-500 transition-colors"><Instagram className="w-5 h-5" /></a>
            <a href="#" className="hover:text-blue-500 transition-colors"><Twitter className="w-5 h-5" /></a>
            <a href="#" className="hover:text-blue-500 transition-colors"><Github className="w-5 h-5" /></a>
          </div>

          {/* Payment Icons Placeholder */}
          <div className="flex gap-2 grayscale opacity-50">
            <div className="h-6 w-10 bg-white/20 rounded"></div>
            <div className="h-6 w-10 bg-white/20 rounded"></div>
            <div className="h-6 w-10 bg-white/20 rounded"></div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;