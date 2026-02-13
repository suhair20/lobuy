import React from 'react';
import { CheckCircle, Loader2, Package, ChevronRight, XCircle, Clock } from "lucide-react";
import Header from './Header';
import { Link } from 'react-router-dom';
import { useGetMyOrdersQuery } from '../../../slices/userSlice';

function Orders() {
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  if (isLoading) return (
    <div className="h-screen flex items-center justify-center bg-white">
      <Loader2 className="animate-spin text-blue-600" size={40} />
    </div>
  );

  if (error) return (
    <div className="h-screen flex flex-col items-center justify-center text-center p-4">
      <XCircle size={48} className="text-red-500 mb-4" />
      <h2 className="text-xl font-bold">Failed to load orders</h2>
      <p className="text-gray-500">Please check your connection and try again.</p>
    </div>
  );

  // Helper to get status styles
  const getStatusDetails = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return { color: 'text-green-600', bg: 'bg-green-50', icon: <CheckCircle size={16} /> };
      case 'cancelled':
      case 'returned or cancelled':
        return { color: 'text-red-600', bg: 'bg-red-50', icon: <XCircle size={16} /> };
      case 'shipped':
      case 'out-for-delivery':
        return { color: 'text-blue-600', bg: 'bg-blue-50', icon: <Package size={16} /> };
      default:
        return { color: 'text-amber-600', bg: 'bg-amber-50', icon: <Clock size={16} /> };
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <Header />
      
      <div className="max-w-5xl mx-auto p-4 md:p-10">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tight italic">
            My <span className="text-blue-600">Orders.</span>
          </h1>
          <p className="text-slate-500 font-medium">Manage and track your recent purchases</p>
        </header>

        <div className="space-y-4">
          {orders?.length > 0 ? (
            orders.map((item) => {
              const statusInfo = getStatusDetails(item.orderStatus);
              const isCancelled = item.orderStatus.toLowerCase().includes('cancel');

              return (
                <Link key={item._id} to={`/Orderdetials/${item._id}`} className="block group">
                  <div className="flex flex-col md:flex-row items-center gap-6 p-5 border border-slate-100 rounded-[1.5rem] bg-white hover:shadow-xl hover:shadow-blue-900/5 transition-all duration-300 relative overflow-hidden">
                    
                    {/* Status indicator line for mobile */}
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${statusInfo.color.replace('text', 'bg')}`} />

                    {/* Image Section */}
                    <div className="w-full md:w-28 h-28 bg-slate-50 rounded-xl p-2 flex items-center justify-center border border-slate-50 shrink-0">
                      <img
                        src={item.products[0]?.productId?.images?.[0]?.url}
                        alt=""  
                        className={`h-full w-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110 ${isCancelled ? 'grayscale opacity-50' : ''}`}
                      />
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 w-full space-y-2">
                      <div className="flex justify-between items-start">
                        <p className={`font-bold text-lg leading-tight line-clamp-1 ${isCancelled ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                          {item.products[0]?.productId?.name}
                        </p>
                        <span className="font-black text-xl text-slate-900 md:hidden">₹{item.subtotal}</span>
                      </div>
                      
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                        Order ID: #{item._id.slice(-8)}
                        {item.products.length > 1 && <span className="text-blue-600 ml-2">+ {item.products.length - 1} other items</span>}
                      </p>

                      <div className="flex flex-wrap items-center gap-3 mt-4">
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${statusInfo.bg} ${statusInfo.color}`}>
                          {statusInfo.icon}
                          {item.orderStatus}
                        </div>
                        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                          {isCancelled ? 'Cancelled On: ' : 'Updated: '} 
                          {new Date(item.updatedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                        </p>
                      </div>
                    </div>

                    {/* Desktop Price & Action */}
                    <div className="hidden md:flex flex-col items-end gap-2">
                      <div className="font-black text-2xl tracking-tighter text-slate-900">₹{item.subtotal}</div>
                      <div className="flex items-center gap-1 text-blue-600 font-bold text-xs uppercase tracking-widest group-hover:gap-2 transition-all">
                        Details <ChevronRight size={14} strokeWidth={3} />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="text-center py-20 bg-white rounded-[2rem] border border-dashed border-slate-200">
              <Package size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500 font-bold uppercase tracking-widest">No orders found yet</p>
              <Link to="/" className="text-blue-600 font-bold text-sm mt-4 inline-block hover:underline">Start Shopping</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Orders;