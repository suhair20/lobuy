import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
  CheckCircle, Package, Truck, Home, 
  XCircle, Download, AlertTriangle, ArrowLeft, Phone, Calendar, CreditCard
} from "lucide-react";
import Header from './Header';
import { useGetOrderDetailsQuery, useCancelOrderMutation } from '../../../slices/userSlice';

function OrderDetials() {
  const { id } = useParams();
  const [showCancelModal, setShowCancelModal] = useState(false);
  
  const { data: order, isLoading, error } = useGetOrderDetailsQuery(id);
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

  if (isLoading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );
  
  if (error) return (
    <div className="text-center mt-20 text-red-500 font-bold p-4">
      <XCircle className="mx-auto mb-4" size={48} />
      <p>Order not found or an error occurred.</p>
    </div>
  );

  const handleConfirmCancel = async () => {
    try {
      await cancelOrder(id).unwrap();
      setShowCancelModal(false);
    } catch (err) {
      alert(err?.data?.message || "Failed to cancel order");
    }
  };

  const statusMap = { 'pending': 0, 'placed': 0, 'shipped': 1, 'out-for-delivery': 2, 'delivered': 3 };
  const currentStep = statusMap[order.orderStatus.toLowerCase()] ?? 0;
  const isCancelled = order.orderStatus.toLowerCase() === 'cancelled';

  return (
    <div className="bg-slate-50 min-h-screen pb-10">
      <Header />
      
      <div className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 transition-all duration-300 ${showCancelModal ? 'blur-md scale-[0.99]' : ''}`}>
        
        {/* Top Navigation & Invoice */}
        <div className="flex flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <button onClick={() => window.history.back()} className="flex items-center gap-2 text-slate-600 hover:text-black font-semibold transition">
            <ArrowLeft size={20} /> Back to My Orders
          </button>
         <button className="w-auto flex items-center justify-center gap-1.5 sm:gap-2 text-blue-600 font-bold border-2 border-blue-600 px-3 py-1.5 sm:px-5 sm:py-2 rounded-lg sm:rounded-xl hover:bg-blue-600 hover:text-white transition-all text-xs sm:text-base">
  <Download size={14} className="sm:w-[18px] sm:h-[18px]" /> 
  <span>Download Invoice</span>
</button>
        </div>

        {/* Header Info Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-800 uppercase tracking-tight">Order Details</h1>
            <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
              ID: <span className="font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">#{order._id}</span>
            </p>
          </div>
          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl w-full md:w-auto">
             <Calendar className="text-slate-400" size={20} />
             <div>
               <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Date Placed</p>
               <p className="font-bold text-slate-800 text-sm">
                 {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
               </p>
             </div>
          </div>
        </div>

        {/* Status Tracker */}
        {!isCancelled ? (
          <div className="bg-white p-6 sm:p-10 rounded-2xl shadow-sm border border-slate-100 mb-6 overflow-x-auto">
            <div className="flex items-center min-w-[500px] justify-between px-4">
              {['Placed', 'Shipped', 'On Way', 'Delivered'].map((label, i) => (
                <React.Fragment key={i}>
                  <div className="flex flex-col items-center relative z-10">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${i <= currentStep ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-100 text-slate-400'}`}>
                      {i <= currentStep ? <CheckCircle size={22} /> : (i === 1 ? <Package size={22} /> : <Truck size={22} />)}
                    </div>
                    <p className={`text-[10px] mt-3 font-black uppercase tracking-widest ${i <= currentStep ? 'text-blue-600' : 'text-slate-400'}`}>{label}</p>
                  </div>
                  {i < 3 && (
                    <div className="flex-1 h-1 mx-2 -mt-8 rounded-full bg-slate-100 overflow-hidden">
                      <div className={`h-full transition-all duration-1000 ${i < currentStep ? 'bg-blue-600 w-full' : 'w-0'}`} />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-red-50 border-2 border-red-100 p-6 rounded-2xl flex items-center gap-4 mb-6 animate-pulse">
            <div className="bg-red-100 p-3 rounded-full"><XCircle size={32} className="text-red-600" /></div>
            <div>
              <h3 className="text-red-800 font-black text-lg uppercase tracking-tight">This Order was Cancelled</h3>
              <p className="text-red-600 text-sm font-medium">Refund will be processed within 5-7 business days.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Content (Products) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="p-5 border-b border-slate-50 bg-slate-50/50">
                <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                  <Package size={18} className="text-blue-600" /> Your Items ({order.products.length})
                </h3>
              </div>
              <div className="divide-y divide-slate-50">
                {order.products.map((item, index) => (
                  <div key={index} className="flex flex-col sm:flex-row gap-6 p-6 items-center hover:bg-slate-50/50 transition-colors">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 flex-shrink-0 bg-white rounded-2xl p-2 border border-slate-100 shadow-sm">
                       <img src={item.productId?.images?.[0]?.url} className="w-full h-full object-contain" alt="" />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h4 className="font-bold text-slate-800 text-lg leading-tight">{item.productId?.name}</h4>
                      <div className="flex flex-wrap justify-center sm:justify-start gap-4 mt-2">
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Qty: {item.quantity}</p>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Unit Price: ₹{item.price}</p>
                      </div>
                      <p className="text-2xl font-black mt-3 text-slate-900 leading-none">₹{item.price * item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cancel Trigger */}
            {!isCancelled && (order.orderStatus === 'placed' || order.orderStatus === 'pending') && (
              <div className="bg-white p-6 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-center sm:text-left">
                <div className="flex items-center gap-3">
                  <div className="bg-orange-50 p-2 rounded-lg"><AlertTriangle className="text-orange-500" size={20} /></div>
                  <p className="text-slate-500 text-sm font-medium">Changed your mind? You can still cancel this order.</p>
                </div>
                <button 
                  onClick={() => setShowCancelModal(true)}
                  className="w-full sm:w-auto bg-red-50 text-red-600 px-8 py-3 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-red-600 hover:text-white transition-all shadow-sm"
                >
                  Cancel Order
                </button>
              </div>
            )}
          </div>

          {/* Sidebar (Address & Summary) */}
          <div className="space-y-6">
            {/* Shipping Card */}
            <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-xl shadow-slate-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10"><Home size={80} /></div>
              <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-blue-400 mb-6 flex items-center gap-2">
                Shipping Address
              </h3>
              <p className="font-black text-xl mb-2">{order.delivery_address.fullName}</p>
              <div className="text-slate-300 text-sm leading-relaxed mb-6 space-y-1">
                <p>{order.delivery_address.addressLine}</p>
                <p>{order.delivery_address.city}, {order.delivery_address.state} - {order.delivery_address.pincode}</p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-800">
                <Phone size={16} className="text-blue-400" />
                <span className="font-bold text-sm tracking-widest">{order.delivery_address.phone}</span>
              </div>
            </div>

            {/* Billing Card */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="font-black text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-6 border-b pb-4">
                Billing Summary
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-bold flex items-center gap-2"><CreditCard size={16}/> Payment</span>
                  <span className="font-black text-slate-800">{order.payment}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 font-bold">Shipping</span>
                  <span className="text-green-600 font-black text-xs uppercase bg-green-50 px-2 py-1 rounded">Free</span>
                </div>
                <div className="flex justify-between items-end pt-6 border-t border-slate-100">
                  <span className="font-black text-slate-400 uppercase text-[10px] tracking-widest">Grand Total</span>
                  <span className="text-3xl font-black text-blue-600 leading-none tracking-tighter">₹{order.subtotal}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* --- RESPONSIVE MODAL --- */}
      {showCancelModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md transition-opacity" onClick={() => setShowCancelModal(false)}></div>
          
          <div className="bg-white relative z-10 w-full max-w-md rounded-[2.5rem] shadow-2xl p-8 sm:p-10 text-center animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-12">
              <AlertTriangle size={40} />
            </div>
            
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Cancel Order?</h2>
            <p className="text-slate-500 mt-3 font-medium leading-relaxed">
              Are you sure you want to stop the delivery of these items? This action is permanent.
            </p>

            <div className="flex flex-col gap-3 mt-8">
              <button 
                onClick={handleConfirmCancel}
                disabled={isCancelling}
                className="w-full py-4 bg-red-600 text-white font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-red-700 transition shadow-lg shadow-red-100 disabled:bg-slate-300"
              >
                {isCancelling ? "Processing..." : "Yes, Cancel Order"}
              </button>
              <button 
                onClick={() => setShowCancelModal(false)}
                className="w-full py-4 bg-slate-100 text-slate-600 font-black uppercase tracking-widest text-xs rounded-2xl hover:bg-slate-200 transition"
              >
                No, Keep it
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrderDetials;