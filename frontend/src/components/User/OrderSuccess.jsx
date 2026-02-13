import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

function OrderSuccess() {
  const { id } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center border border-gray-100">
        
        {/* Success Icon */}
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-black text-gray-900 mb-2">Order Placed!</h1>
        <p className="text-gray-500 mb-6">
          Thank you for your purchase. Your order has been received and is being processed.
        </p>

        {/* Order Details Card */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-8 border border-gray-100">
          <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Order ID</p>
          <p className="text-sm font-mono font-bold text-blue-900 break-all">{id}</p>
        </div>

        <div className="space-y-3">
          <button 
            onClick={() => navigate('/orders')}
            className="w-full bg-blue-900 text-white py-4 rounded-xl font-bold hover:bg-blue-800 transition-all"
          >
            VIEW MY ORDERS
          </button>
          
          <Link 
            to="/" 
            className="block w-full py-4 text-blue-900 font-bold hover:text-blue-700 transition-all text-sm"
          >
            CONTINUE SHOPPING
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            A confirmation email has been sent to your registered address.
          </p>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;