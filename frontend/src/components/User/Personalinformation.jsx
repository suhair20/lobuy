import React, { useState } from 'react';
import { User, Mail, Phone, ShieldCheck, Edit3, Save, X } from 'lucide-react';

function Personalinformation() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    gender: "",
    email: "",
    phone: ""
  });

  return (
    <div className="max-w-3xl animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10 border-b border-slate-100 pb-6">
        <div>
          <h2 className="   text-xl  md:text-2xl font-bold text-slate-800 uppercase tracking-tighter italic">
            Personal <span className="text-blue-950">Details.</span>
          </h2>
          <p className="text-slate-400 font-medium text-sm mt-1">Manage your identity and contact info</p>
        </div>
        
        <button 
          onClick={() => setIsEditing(!isEditing)}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-sm transition-all shadow-sm ${
            isEditing 
            ? 'bg-slate-100 text-slate-600 hover:bg-slate-200' 
            : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100'
          }`}
        >
          {isEditing ? <><X size={16} /> Cancel</> : <><Edit3 size={16} /> Edit Profile</>}
        </button>
      </div>

      <div className="space-y-10">
        
        {/* Name Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">First Name</label>
            <div className="relative">
              <input
                type="text"
                disabled={!isEditing}
                className={`w-full p-4 rounded-2xl border transition-all duration-300 font-bold ${
                  isEditing 
                  ? 'bg-white border-blue-200 focus:ring-4 focus:ring-blue-50 outline-none' 
                  : 'bg-slate-50 border-transparent text-slate-500 cursor-not-allowed'
                }`}
                defaultValue={formData.firstName}
              />
              {!isEditing && <ShieldCheck size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300" />}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Last Name</label>
            <input
              type="text"
              disabled={!isEditing}
              className={`w-full p-4 rounded-2xl border transition-all duration-300 font-bold ${
                isEditing 
                ? 'bg-white border-blue-200 focus:ring-4 focus:ring-blue-50 outline-none' 
                : 'bg-slate-50 border-transparent text-slate-500 cursor-not-allowed'
              }`}
              defaultValue={formData.lastName}
            />
          </div>
        </div>

        {/* Custom Gender Selection */}
        <div className="space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Identity</p>
          <div className="flex gap-4">
            {['Male', 'Female', 'Other'].map((option) => (
              <button
                key={option}
                disabled={!isEditing}
                onClick={() => setFormData({...formData, gender: option})}
                className={`flex-1 py-4 px-6 rounded-2xl border-2 font-black uppercase tracking-widest text-[10px] transition-all ${
                  formData.gender === option 
                  ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-lg shadow-blue-100' 
                  : 'border-slate-100 text-slate-400 bg-white'
                } ${!isEditing && 'opacity-60 cursor-not-allowed'}`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-6 border-t border-slate-50">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-800">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Mail size={18} /></div>
              <h3 className="font-bold uppercase tracking-tight">Email Address</h3>
            </div>
            <input
              type="email"
              disabled
              className="w-full p-4 rounded-2xl bg-slate-50 border-transparent text-slate-400 font-medium italic cursor-not-allowed"
              value={formData.email}
            />
            <p className="text-[10px] text-slate-400 font-bold ml-1 italic">Verified Account</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-slate-800">
              <div className="p-2 bg-green-50 rounded-lg text-green-600"><Phone size={18} /></div>
              <h3 className="font-bold uppercase tracking-tight">Phone Number</h3>
            </div>
            <input
              type="tel"
              disabled={!isEditing}
              className={`w-full p-4 rounded-2xl border transition-all duration-300 font-bold ${
                isEditing 
                ? 'bg-white border-blue-200 outline-none' 
                : 'bg-slate-50 border-transparent text-slate-500'
              }`}
              defaultValue={formData.phone}
            />
          </div>
        </div>

        {/* Save Button (Only shows when editing) */}
        {isEditing && (
          <button className="w-full sm:w-auto px-12 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2">
            <Save size={18} /> Save Changes
          </button>
        )}
      </div>
    </div>
  );
}

export default Personalinformation;