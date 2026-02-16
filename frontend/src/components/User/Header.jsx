import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from "react-redux";
import { 
  MagnifyingGlassIcon, 
  Bars3Icon, 
  XMarkIcon, 
  UserIcon 
} from '@heroicons/react/24/outline';
import { ShoppingCart, User as UserLucide, ShieldCheck } from "lucide-react"; // Added ShieldCheck
import { useGetCategoriesQuery } from '../../../slices/userSlice';

// Added { minimal = false } prop
function Header({ minimal = false }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { data: categories = [], isLoading } = useGetCategoriesQuery();

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className="w-full z-50 sticky top-0">
      {/* 1. Hide Promotion Bar in Minimal Mode */}
      {!minimal && (
        <div className="w-full py-2 text-[11px] md:text-[12px] font-medium flex items-center justify-center bg-gradient-to-tr from-blue-950 to-black text-white px-4 text-center">
          <p>Have you tried the Phonefix app? Discover now!</p>
        </div>
      )}

      <header className="bg-white/95 backdrop-blur-md border-b border-blue-200 shadow-md transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center justify-between h-16 md:h-20 gap-4">
            
            {/* 2. Hide Mobile Menu Toggle in Minimal Mode */}
            {!minimal && (
              <button 
                className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-md" 
                onClick={() => setMenuOpen(true)}
              >
                <Bars3Icon className="h-6 w-6" />
              </button>
            )}

            {/* Logo - Always Visible */}
            <Link to="/" className="flex-shrink-0">
              <h1 className="text-2xl md:text-3xl font-serif font-extrabold tracking-tight text-blue-950">
                LOBUY
              </h1>
            </Link>

            {/* 3. Hide Search Bar in Minimal Mode */}
            {!minimal && (
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
            )}

            {/* 4. Auth & Cart Section (Replaced with "Secure" text if minimal) */}
            <div className="flex items-center space-x-2 md:space-x-6">
              {minimal ? (
                <div className="flex items-center gap-2 text-blue-900 font-bold uppercase text-xs tracking-widest">
                  <ShieldCheck className="w-5 h-5" />
                  <span>Secure Checkout</span>
                </div>
              ) : (
                isAuthenticated ? (
                  <div className="flex items-center space-x-4">
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
                  <Link to="/login" className="flex items-center gap-2 px-4 py-2 bg-blue-950 text-white rounded-full hover:bg-black transition-all">
                    <UserIcon className="h-5 w-5" />
                    <span className="hidden md:inline text-sm font-medium">Login</span>
                  </Link>
                )
              )}
            </div>
          </div>

          {/* 5. Hide Desktop Category Links in Minimal Mode */}
          {!minimal && (
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
          )}
        </div>
      </header>

      {/* 6. Mobile Drawer Logic (Only render if not minimal) */}
      {!minimal && menuOpen && (
        <div className={`fixed inset-0 z-[100] transition-opacity duration-300`}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMenuOpen(false)} />
          <aside className={`absolute top-0 left-0 w-80 h-full bg-white shadow-2xl transform transition-transform duration-300 ease-in-out translate-x-0`}>
             {/* ... Mobile Menu content same as before ... */}
          </aside>
        </div>
      )}
    </div>
  );
}

export default Header;
 
  

