import React, { useState, useEffect } from "react";
import { useVerifyOtpMutation } from "../../../slices/userSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setauthenticated } from "../../../slices/AuthSlice";
import { ShieldCheck, X, Loader2 } from "lucide-react";

const OtpModal = ({ email, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [verifyOtp, { isLoading }] = useVerifyOtpMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const data = await verifyOtp({ email, otp }).unwrap();
      dispatch(setauthenticated(data.user));
      navigate("/", { replace: true }); // replace: true prevents back-button issues
    } catch (err) {
      setError(err?.data?.message || "Invalid OTP code. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* Glassmorphism Backdrop */}
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Top Decorative Bar */}
        <div className="h-2 bg-blue-600 w-full" />
        
        <button onClick={onClose} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors">
          <X size={20} />
        </button>

        <div className="p-8 md:p-10">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
              <ShieldCheck size={36} strokeWidth={1.5} />
            </div>

            <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">
              Security Verification
            </h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-8">
              We've sent a 6-digit verification code to <br />
              <span className="font-bold text-slate-700">{email}</span>
            </p>

            <form onSubmit={handleSubmit} className="w-full space-y-6">
              <div className="relative">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="0 0 0 0 0 0"
                  className={`w-full bg-slate-50 border-2 ${error ? 'border-red-200 focus:border-red-500' : 'border-slate-100 focus:border-blue-500'} rounded-2xl p-4 text-center text-2xl font-black tracking-[0.5em] transition-all outline-none placeholder:text-slate-200 text-slate-800`}
                  maxLength={6}
                  required
                />
                {error && (
                  <p className="text-red-500 text-xs font-bold mt-2 animate-bounce">
                    {error}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading || otp.length !== 6}
                className="w-full bg-blue-600 disabled:bg-slate-200 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-none transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Verifying...
                  </>
                ) : (
                  "Confirm & Login"
                )}
              </button>
            </form>

            <div className="mt-8 text-sm">
              <p className="text-slate-400 font-medium">
                Didn't get the code? <button className="text-blue-600 font-bold hover:underline">Resend OTP</button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpModal;
