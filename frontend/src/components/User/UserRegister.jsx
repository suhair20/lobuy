import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { useSignupMutation } from '../../../slices/userSlice';
import OtpModal from './otpModal';
import { Eye, EyeOff, Loader2, Mail, Lock, CheckCircle2 } from "lucide-react";

function UserRegister() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [Password, setPassword] = useState('');
  const [email, setemail] = useState('');
  const [showOtp, setShowOtp] = useState(false);

  const [signup, { isLoading: isSignupLoading }] = useSignupMutation();

  const validateForm = (email, password) => {
    if (!email) {
      setError('Email is required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!password) {
      setError('Password is required');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    setError('');
    return true;
  };

  const submithandler = async (e) => {
    e.preventDefault();
    const isvalid = validateForm(email, Password);
    if (!isvalid) return;

    try {
      const response = await signup({ email, Password }).unwrap();
      if (response.success) {
        setShowOtp(true);
      }
    } catch (error) {
      setError(error?.data?.message || "Registration failed. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fcfdfa] px-6 py-12">
      <div className="max-w-md w-full">
        {/* Logo Section */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-blue-950 tracking-tighter">
            Lobuy<span className="text-blue-600">.</span>
          </h1>
          <p className="text-slate-500 mt-2 font-medium font-sans">Start your premium shopping journey.</p>
        </div>

        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-400/50 p-8 md:p-10 border border-slate-100 relative">
          
          <form className="space-y-5" onSubmit={submithandler}>
            {error && (
              <div className="bg-red-50 text-red-600 p-3.5 rounded-2xl text-xs font-bold border border-red-100 animate-in fade-in slide-in-from-top-1">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  type="email"
                  onChange={(e) => setemail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-700 placeholder:text-slate-300"
                  placeholder="hello@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-12 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-700 placeholder:text-slate-300"
                  placeholder="Min. 6 characters"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-blue-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-start gap-3 p-1">
              <div className="relative flex items-center">
                <input type="checkbox" className="w-5 h-5 rounded-lg border-slate-200 text-blue-600 focus:ring-blue-500 cursor-pointer" />
              </div>
              <p className="text-[12px] leading-relaxed text-slate-500 font-medium">
                I agree to the <span className="text-blue-600 cursor-pointer hover:underline font-bold">Terms</span> and want to receive the <span className="text-blue-600 cursor-pointer hover:underline font-bold">Lobuy newsletter</span>.
              </p>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-950 text-white font-bold py-4 rounded-2xl hover:bg-blue-900 transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-3"
              disabled={isSignupLoading}
            >
              {isSignupLoading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest text-slate-400">
              <span className="bg-white px-4">Social Signup</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all font-bold text-slate-600 text-sm">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="Google" />
              Google
            </button>
            <button className="flex items-center justify-center gap-2 py-3 border border-slate-100 rounded-2xl hover:bg-slate-50 transition-all font-bold text-slate-600 text-sm">
              <img src="https://www.svgrepo.com/show/442935/apple-logo.svg" className="w-5 h-5" alt="Apple" />
              Apple
            </button>
          </div>
        </div>

        <p className="text-center text-slate-500 font-medium mt-8">
          Already a member?{" "}
          <Link to="/login" className="text-blue-600 font-bold hover:underline underline-offset-4">
            Log in here
          </Link>
        </p>
      </div>

      {/* OtpModal with onClose to allow the user to go back to the email form if needed */}
      {showOtp && <OtpModal email={email} onClose={() => setShowOtp(false)} />}
    </div>
  );
}

export default UserRegister;
