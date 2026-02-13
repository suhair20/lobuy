import React, { useState, useEffect } from 'react';
import { MapPin, Plus, MoreVertical, Home, Briefcase, Phone, Navigation } from 'lucide-react';
import AddaddressComponent from './AddaddressComponent';
import { useGetAddressQuery } from '../../../slices/userSlice';

function ManageAddress() {
    const [activeMenu, setActiveMenu] = useState("profile");
    const { data, isLoading, error, refetch } = useGetAddressQuery();

    useEffect(() => {
        if (activeMenu === "profile") {
            refetch();
        }
    }, [activeMenu, refetch]);

    if (activeMenu === "address") {
        return (
            <div className="animate-in slide-in-from-right duration-500">
                <div className="flex items-center gap-4 mb-8">
                    <button 
                        onClick={() => setActiveMenu("profile")}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                    >
                        <Navigation className="-rotate-90 text-slate-400" size={20} />
                    </button>
                    <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter italic">
                        New <span className="text-blue-600">Location.</span>
                    </h2>
                </div>
                <div className="bg-white p-2 rounded-3xl border border-slate-100">
                    <AddaddressComponent onSaved={() => setActiveMenu("profile")} />
                </div>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-500">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h2 className="  text-xl md:text-2xl font-bold text-slate-800 uppercase tracking-tighter italic">
                        Saved <span className="text-blue-950">Addresses.</span>
                    </h2>
                    <p className="text-slate-400 font-medium text-sm mt-1">Manage your delivery locations</p>
                </div>

                <button 
                    onClick={() => setActiveMenu("address")}
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                >
                    <Plus size={16} strokeWidth={3} /> Add New Address
                </button>
            </div>

            {/* Address List Grid */}
            <div className="space-y-4">
                {isLoading && (
                    <div className="py-10 text-center animate-pulse">
                        <MapPin className="mx-auto text-slate-200 mb-2" size={40} />
                        <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Locating addresses...</p>
                    </div>
                )}

                {error && (
                    <div className="p-6 bg-red-50 rounded-2xl border border-red-100 text-red-600 text-center">
                        <p className="font-bold">Failed to load addresses. Please try again.</p>
                    </div>
                )}

                {data?.addresses?.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4">
                        {data.addresses.map((addr) => (
                            <div 
                                key={addr._id} 
                                className="group relative bg-white border border-slate-100 rounded-[2rem] p-6 hover:shadow-xl hover:shadow-slate-200/50 hover:border-blue-100 transition-all duration-300"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
                                        {/* Icon Type */}
                                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                                            {addr.type?.toLowerCase() === 'home' ? <Home size={20} /> : <Briefcase size={20} />}
                                        </div>
                                        
                                        <div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-slate-100 text-slate-500 rounded-full">
                                                    {addr.type}
                                                </span>
                                                <h4 className="font-black text-slate-800 uppercase tracking-tight">{addr.fullName}</h4>
                                            </div>
                                            
                                            <p className="text-slate-500 font-medium text-sm mt-2 leading-relaxed max-w-md">
                                                {addr.addressLine}, {addr.city}, {addr.state} - <span className="font-bold text-slate-900">{addr.pincode}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                                        <MoreVertical size={20} className="text-slate-300" />
                                    </button>
                                </div>

                                <div className="mt-6 pt-6 border-t border-slate-50 flex items-center gap-6">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Phone size={14} />
                                        <span className="text-xs font-bold tracking-widest">{addr.phone}</span>
                                    </div>
                                    <button className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-800 transition-colors">
                                        Edit Address
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : !isLoading && (
                    <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
                        <MapPin size={48} className="mx-auto text-slate-300 mb-4" />
                        <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No saved addresses found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ManageAddress;