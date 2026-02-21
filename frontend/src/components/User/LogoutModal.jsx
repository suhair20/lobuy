import React from 'react';
import { LogOut, X } from 'lucide-react';

const LogoutModal = ({ isOpen, onClose, onConfirm, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl transform transition-all animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <LogOut className="text-red-500" size={30} />
          </div>
          
          <h3 className="text-xl font-bold text-gray-900">Wait! Logging out?</h3>
          <p className="text-gray-500 mt-2">
            Are you sure you want to log out of your Lobuy account?
          </p>

          <div className="grid grid-cols-2 gap-3 w-full mt-8">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="py-3 px-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="py-3 px-4 bg-red-500 text-white font-semibold rounded-xl hover:bg-red-600 shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2"
            >
              {isLoading ? "Leaving..." : "Yes, Logout"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;