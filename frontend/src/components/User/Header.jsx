import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from "react-redux";
import { 
  MagnifyingGlassIcon, 
  Bars3Icon, 
  XMarkIcon, 
  UserIcon 
} from '@heroicons/react/24/outline';
import { ShoppingCart, User as UserLucide } from "lucide-react";
import { useGetCategoriesQuery } from '../../../slices/userSlice';

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(""); // Fixed missing state
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { data: categories = [], isLoading } = useGetCategoriesQuery();

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    // Add navigation logic here if needed: e.g., navigate(`/search?q=${e.target.value}`)
  };

  return (
    <div className="w-full z-50 sticky top-0">
      {/* Top Promotion Bar */}
      <div className="w-full py-2 text-[11px] md:text-[12px] font-medium flex items-center justify-center bg-gradient-to-tr from-blue-950 to-black text-white px-4 text-center">
        <p>Have you tried the Phonefix app? Discover now!</p>
      </div>

      <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Main Navigation Row */}
          <div className="flex items-center justify-between h-16 md:h-20 gap-4">
            
            {/* Left: Mobile Menu Toggle */}
            <button 
              className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-md" 
              onClick={() => setMenuOpen(true)}
            >
              <Bars3Icon className="h-6 w-6" />
            </button>

            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-2xl md:text-3xl font-serif font-extrabold tracking-tight text-blue-950">
                LOBUY
              </h1>
            </Link>

            {/* Center: Search Bar (Desktop) */}
            <div className="hidden md:flex relative flex-1 max-w-md mx-8">
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

            {/* Right: Auth & Cart */}
            <div className="flex items-center space-x-2 md:space-x-6">
              {isAuthenticated ? (
                <div className="flex items-center space-x-4">
                  <Link to="/profile" className="group flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors">
                    <UserLucide className="w-5 h-5" />
                    <span className="hidden lg:block text-sm font-semibold">Account</span>
                  </Link>
                  <Link to="/cart" className="relative group flex items-center gap-2 text-gray-700 hover:text-blue-600 transition-colors">
                    <ShoppingCart className="w-5 h-5" />
                    <span className="hidden lg:block text-sm font-semibold">Cart</span>
                    {/* Optional: Cart Badge */}
                    <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">0</span>
                  </Link>
                </div>
              ) : (
                <Link to="/login" className="flex items-center gap-2 px-4 py-2 bg-blue-950 text-white rounded-full hover:bg-black transition-all">
                  <UserIcon className="h-5 w-5" />
                  <span className="hidden md:inline text-sm font-medium">Login</span>
                </Link>
              )}
            </div>
          </div>

          {/* Desktop Category Links */}
          <nav className="hidden lg:flex items-center justify-center space-x-32 py-3 border-t border-gray-50">
            <Link to="/" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Home</Link>
            {!isLoading && categories.map((cat) => (
              <Link 
                key={cat._id} 
                to={`/shop/${cat._id}`} 
                className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
            <Link to="/contact" className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors">Contact</Link>
          </nav>
        </div>
      </header>

      {/* Mobile Drawer (Overlay + Panel) */}
      <div className={`fixed inset-0 z-[100] transition-opacity duration-300 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
        
        {/* Panel */}
        <aside className={`absolute top-0 left-0 w-80 h-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${menuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex items-center justify-between p-5 border-b">
            <h2 className="text-xl font-bold font-serif">Menu</h2>
            <button onClick={() => setMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="flex flex-col p-4 space-y-2">
            <Link to="/" onClick={() => setMenuOpen(false)} className="p-3 text-lg font-medium hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all">Home</Link>
            
            <div className="py-2">
              <p className="px-3 text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Categories</p>
              {!isLoading && categories.map((cat) => (
                <Link 
                  key={cat._id} 
                  to={`/shop/${cat._id}`} 
                  onClick={() => setMenuOpen(false)}
                  className="block p-3 text-lg font-medium hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all"
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            <Link to="/contact" onClick={() => setMenuOpen(false)} className="p-3 text-lg font-medium hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-all border-t">Contact Us</Link>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Header;







    
 
  

