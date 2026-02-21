import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from "react-redux";
import { 
  MagnifyingGlassIcon, 
  Bars3Icon, 
  XMarkIcon, 
  UserIcon 
} from '@heroicons/react/24/outline';
import { ShoppingCart, User as UserLucide, ShieldCheck } from "lucide-react";
import { useGetCategoriesQuery } from '../../../slices/userSlice';

function Header({ minimal = false }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { data: categories = [], isLoading } = useGetCategoriesQuery();

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="w-full z-50 sticky top-0 bg-white">
      {/* 1. Promotion Bar */}
      {!minimal && (
        <div className="w-full py-2 text-[11px] md:text-[12px] font-medium flex items-center justify-center bg-gradient-to-tr from-blue-950 to-black text-white px-4 text-center">
          <p>Have you tried the Phonefix app? Discover now!</p>
        </div>
      )}

      <header className="bg-white/95 backdrop-blur-md border-b border-blue-200 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Main Navbar Row - Grid-like behavior using Flex */}
          <div className="flex items-center h-16 md:h-20">
            
            {/* LEFT SECTION: Logo & Mobile Toggle */}
            <div className="flex flex-1 items-center justify-start gap-4">
              {!minimal && (
                <button 
                  className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-md" 
                  onClick={() => setMenuOpen(true)}
                >
                  <Bars3Icon className="h-6 w-6" />
                </button>
              )}
              <Link to="/" className="flex-shrink-0">
                <h1 className="text-xl md:text-3xl font-serif font-extrabold tracking-tight text-blue-950">
                  LOBUY<span className="text-blue-500">.</span>
                </h1>
              </Link>
            </div>

            {/* CENTER SECTION: Search Bar (Desktop Only) */}
            {!minimal && (
              <div className="hidden md:flex flex-[1.5] justify-center px-4">
                <div className="relative w-full max-w-md">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                  </span>
                  <input
                    type="text"
                    placeholder="Search premium products..."
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full bg-gray-50 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                    value={searchTerm}
                    onChange={handleSearch}
                  />
                </div>
              </div>
            )}

            {/* RIGHT SECTION: Auth & Cart */}
            <div className="flex flex-1 items-center justify-end">
              {minimal ? (
                <div className="flex items-center gap-1 text-blue-900 font-bold uppercase text-[10px] md:text-xs tracking-widest whitespace-nowrap">
                  <ShieldCheck className="w-5 h-5" />
                  <span>Secure Checkout</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 md:space-x-6">
                  {isAuthenticated ? (
                    <div className="flex items-center space-x-3 md:space-x-4">
                      <Link to="/profile" className="group flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors">
                        <UserLucide className="w-5 h-5" />
                        <span className="hidden lg:block text-sm font-semibold">Account</span>
                      </Link>
                      <Link to="/cart" className="relative group flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors">
                        <ShoppingCart className="w-5 h-5" />
                        <span className="hidden lg:block text-sm font-semibold">Cart</span>
                        <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">0</span>
                      </Link>
                    </div>
                  ) : (
                    <Link to="/login" className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-blue-950 text-white rounded-full hover:bg-black transition-all">
                      <UserIcon className="h-4 w-4 md:h-5 md:w-5" />
                      <span className="text-xs md:text-sm font-medium">Login</span>
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Desktop Category Links */}
          {!minimal && (
            <nav className="hidden lg:flex items-center justify-center space-x-24 py-3 border-t border-gray-50">
              <Link to="/" className="relative text-[13px] font-medium text-zinc-700 hover:text-zinc-900 transition-colors group tracking-widest">
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-blue-800 transition-all group-hover:w-full" />
              </Link>
              {!isLoading && categories.map((cat) => (
                <Link 
                  key={cat._id} 
                  to={`/shop/${cat._id}`} 
                  className="relative text-[13px] font-medium text-zinc-700 hover:text-zinc-900 transition-colors group  tracking-widest"
                >
                  {cat.name}
                    <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-blue-900 transition-all group-hover:w-full" />
                </Link>
              ))}
              <Link to="/contact" className="relative text-[13px] font-medium text-zinc-700 hover:text-zinc-900 transition-colors group tracking-widest">Contact
              <span className="absolute -bottom-1 left-0 w-0 h-[1.5px] bg-blue-800 transition-all group-hover:w-full" />
              </Link>
            </nav>
          )}
        </div>
      </header>

      {/* Mobile Drawer (Same as before) */}
      {!minimal && menuOpen && (
        <div className="fixed inset-0 z-[100]">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <aside className="absolute top-0 left-0 w-80 h-full bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
            <div className="p-4 border-b flex justify-between items-center bg-blue-950 text-white">
              <h2 className="text-xl font-bold">Menu</h2>
              <button onClick={() => setMenuOpen(false)} className="p-1 hover:bg-white/10 rounded">
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <nav className="p-4 space-y-2">
              <Link to="/" className="block p-3 text-gray-800 font-semibold hover:bg-gray-100 rounded-lg" onClick={() => setMenuOpen(false)}>Home</Link>
              <div className="py-2">
                <p className="px-3 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Categories</p>
                {!isLoading && categories.map((cat) => (
                  <Link 
                    key={cat._id} 
                    to={`/shop/${cat._id}`} 
                    className="block p-3 text-gray-800 hover:bg-gray-100 rounded-lg"
                    onClick={() => setMenuOpen(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
              <hr />
              <Link to="/contact" className="block p-3 text-gray-800 font-semibold hover:bg-gray-100 rounded-lg" onClick={() => setMenuOpen(false)}>Contact</Link>
            </nav>
          </aside>
        </div>
      )}
    </div>
  );
}

export default Header;