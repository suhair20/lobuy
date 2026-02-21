import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import Personalinformation from './Personalinformation';
import ManageAddress from './ManageAddress';
import LogoutModal from './LogoutModal'; // 1. Import the Modal
import { User, ShoppingBag, Heart, Ticket, HelpCircle, LogOut, ChevronLeft, ChevronRight } from "lucide-react"
import { Link } from 'react-router-dom';
import { logout } from '../../../slices/AuthSlice'
import { useLogoutApiMutation } from '../../../slices/userSlice';

function Profile() {
  const dispatch = useDispatch();
  const [mobilePage, setMobilePage] = useState(null);
  const [activeMenu, setActiveMenu] = useState("profile");
  const [isModalOpen, setIsModalOpen] = useState(false); // 2. State for Modal
  const [logoutApi, { isLoading }] = useLogoutApiMutation();
  const navigate = useNavigate();

  const handleMenuClick = (menu) => {
    setActiveMenu(menu);
    if (window.innerWidth < 768) {
      setMobilePage(menu);
    }
  };

  // 3. This function is called when user clicks "Yes, Logout" in the Modal
  const handleConfirmLogout = async () => {
    try {
      console.log("logout");
      
      await logoutApi().unwrap();
      
      dispatch(logout());
      navigate('/login');
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setIsModalOpen(false);
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />
      
      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 py-8 md:px-16">
        
        {/* Top Icon Grid */}
        <div className="grid grid-cols-2 md:flex md:justify-center gap-4 md:gap-8 mb-10">
          <Link to={'/Orders'} className="w-full md:w-auto">
            <button className="w-full flex flex-col md:flex-row items-center justify-center bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-blue-500 hover:bg-blue-50 transition-all p-6 md:p-8 rounded-2xl gap-3">
              <ShoppingBag className="w-6 h-6 text-blue-600" />
              <span className="text-sm font-bold uppercase tracking-tight text-slate-700">Orders</span>
            </button>
          </Link>
          {/* ... other top buttons (Wishlist, Coupons, Help) ... */}
          <button className="w-full md:w-auto flex flex-col md:flex-row items-center justify-center bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-pink-500 hover:bg-pink-50 transition-all p-6 md:p-8 rounded-2xl gap-3">
            <Heart className="w-6 h-6 text-pink-600" />
            <span className="text-sm font-bold uppercase tracking-tight text-slate-700">Wishlist</span>
          </button>
          <button className="w-full md:w-auto flex flex-col md:flex-row items-center justify-center bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-orange-500 hover:bg-orange-50 transition-all p-6 md:p-8 rounded-2xl gap-3">
            <Ticket className="w-6 h-6 text-orange-600" />
            <span className="text-sm font-bold uppercase tracking-tight text-slate-700">Coupons</span>
          </button>
          <button className="w-full md:w-auto flex flex-col md:flex-row items-center justify-center bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-green-500 hover:bg-green-50 transition-all p-6 md:p-8 rounded-2xl gap-3">
            <HelpCircle className="w-6 h-6 text-green-600" />
            <span className="text-sm font-bold uppercase tracking-tight text-slate-700">Help Center</span>
          </button>
        </div>

        {/* Dashboard Section */}
        <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
          
          {/* MOBILE VIEW */}
          <div className="md:hidden">
            {!mobilePage && (
              <div className="p-6 space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-blue-600 mb-4">
                    <User size={18} strokeWidth={3} />
                    <p className="font-black text-xs uppercase tracking-[0.2em]">Account Settings</p>
                  </div>
                  <div className="space-y-2">
                    <div onClick={() => handleMenuClick("profile")} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl font-bold text-slate-700 active:bg-blue-600 active:text-white transition-all">
                      Profile Information <ChevronRight size={16} />
                    </div>
                    <div onClick={() => handleMenuClick("address")} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl font-bold text-slate-700 active:bg-blue-600 active:text-white transition-all">
                      Manage Address <ChevronRight size={16} />
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 text-blue-600 mb-4 pt-4 border-t border-slate-100">
                    <ShoppingBag size={18} strokeWidth={3} />
                    <p className="font-black text-xs uppercase tracking-[0.2em]">My Own</p>
                  </div>
                  <ul className="space-y-2">
                    {['All Notifications', 'My Reviews', 'My Wishlist'].map((item) => (
                      <li key={item} className="p-4 text-slate-600 font-bold hover:bg-slate-50 rounded-xl cursor-pointer">{item}</li>
                    ))}
                  </ul>
                  {/* MOBILE LOGOUT TRIGGER */}
                  <div 
                    onClick={() => setIsModalOpen(true)} 
                    className="flex items-center gap-2 text-red-500 font-black text-xs uppercase tracking-widest pt-6 mt-6 border-t border-slate-100 cursor-pointer active:opacity-50"
                  >
                    <LogOut size={18} /> Logout
                  </div>
                </div>
              </div>
            )}
            {/* ... Mobile Page renders (profile/address) ... */}
            {mobilePage === "profile" && (
              <div className="animate-in slide-in-from-right duration-300">
                <button className="flex items-center gap-2 p-6 text-blue-600 font-bold" onClick={() => setMobilePage(null)}>
                  <ChevronLeft size={20} /> Back
                </button>
                <div className="p-6 pt-0"><Personalinformation /></div>
              </div>
            )}
            {mobilePage === "address" && (
              <div className="animate-in slide-in-from-right duration-300">
                <button className="flex items-center gap-2 p-6 text-blue-600 font-bold" onClick={() => setMobilePage(null)}>
                  <ChevronLeft size={20} /> Back
                </button>
                <div className="p-6 pt-0"><ManageAddress /></div>
              </div>
            )}
          </div>

          {/* DESKTOP VIEW */}
          <div className="hidden md:flex min-h-[600px]">
            {/* Sidebar */}
            <div className="w-80 border-r border-slate-100 p-8 bg-slate-50/50">
              <div className="flex items-center gap-2 text-blue-600 mb-6">
                <User size={18} strokeWidth={3} />
                <p className="font-black text-xs uppercase tracking-[0.2em]">Account Settings</p>
              </div>
              
              <div className="space-y-2 mb-8">
                <button 
                  onClick={() => handleMenuClick("profile")}
                  className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-all ${activeMenu === "profile" ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "text-slate-500 hover:bg-white hover:shadow-sm"}`}
                >
                  Profile Information
                </button>
                <button 
                  onClick={() => handleMenuClick("address")}
                  className={`w-full text-left px-4 py-3 rounded-xl font-bold transition-all ${activeMenu === "address" ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "text-slate-500 hover:bg-white hover:shadow-sm"}`}
                >
                  Manage Address
                </button>
              </div>

              <div className="flex items-center gap-2 text-blue-600 mb-6 pt-6 border-t border-slate-200">
                <ShoppingBag size={18} strokeWidth={3} />
                <p className="font-black text-xs uppercase tracking-[0.2em]">My Own</p>
              </div>
              
              <ul className="space-y-1 mb-8">
                {['Notification', 'Review', 'Wishlist'].map((item) => (
                  <li 
                    key={item}
                    onClick={() => handleMenuClick(item)}
                    className={`px-4 py-3 rounded-xl font-bold cursor-pointer transition-all ${activeMenu === item ? "bg-blue-600 text-white shadow-lg" : "text-slate-500 hover:bg-white"}`}
                  >
                    My {item}
                  </li>
                ))}
              </ul>

              {/* DESKTOP LOGOUT TRIGGER */}
              <div 
                onClick={() => setIsModalOpen(true)} 
                className="flex items-center gap-2 text-red-500 font-black text-xs uppercase tracking-widest pt-6 border-t border-slate-200 cursor-pointer hover:opacity-70 transition-opacity"
              >
                <LogOut size={18} /> Logout
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 p-10 overflow-y-auto bg-white">
              <div className="max-w-4xl mx-auto">
                {activeMenu === "profile" && <Personalinformation />}
                {activeMenu === "address" && <ManageAddress />}
                {!['profile', 'address'].includes(activeMenu) && (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 italic font-medium">
                    Coming soon...
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4. THE MODAL COMPONENT */}
      <LogoutModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={handleConfirmLogout}
        isLoading={isLoading}
      />
    </div>
  );
}

export default Profile;