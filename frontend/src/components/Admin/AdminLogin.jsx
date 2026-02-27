import React from 'react'
import { useState, } from "react";
import { Link } from 'react-router-dom'
import { useAdminloginMutation } from '../../../slices/AdminSlice.js';
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { setAdminAuthenticated } from "../../../slices/AdminAuth.js";
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
function AdminLogin() {



  const [email, setEmail] = useState("");
  const [Password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] =useState("");

  const dispatch=useDispatch();
  const navigate = useNavigate();
  const [login,{isLoading:isLoginLoading}] = useAdminloginMutation();


 


const handleLogin = async (e) => {
  e.preventDefault();


  
  try {
    const data = await login({email,Password}).unwrap();

    console.log('backen vann',data);
    
    dispatch(setAdminAuthenticated(data.user));

    
    navigate("/admin", { replace: true });

  } catch (err) {
    console.error("Login error:", err);
    setError(err?.data?.message || "Invalid email or password");
  }
};




  return (
   <div  className="min-h-screen  flex flex-col items-center justify-center bg-gray-100 px-6">
     
      <div className="max-w-md w-full bg-white rounded-xl shadow-md p-6">
         <h1 className="text-center text-3xl font-bold text-blue-950 p-4 mb-6 tracking-wider">LoBuY</h1>
        {/* Logo */}
      

        {/* Login Title */}
       

        {/* Form */}
        <form  onSubmit={handleLogin} className="space-y-4 ">
          {error && <p className="text-red-500 mb-2">{error}</p>}
          <div className='grid grid-cols-2 gap-2' >
          <div>
            <label className="block text-sm font-medium text-gray-700">Email address</label>
            <input
              type="email"
              className="w-full border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring focus:border-blue-400"
              placeholder="you@example.com"
               onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
             <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring focus:border-blue-500"
                placeholder="••••••••"
                 onChange={(e) => setPassword(e.target.value)}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-2.5 right-3 cursor-pointer text-gray-400"
              >
                👁
              </span>
            </div>
          </div>
          </div>

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="form-checkbox" />
              <span>Stay logged in</span>
            </label>
            <a href="#" className="text-blue-600 hover:underline">Forgot your password?</a>
          </div>

          <button className="w-full bg-blue-950 text-white py-2 rounded-md font-semibold hover:bg-blue-900">
             {isLoginLoading?(
              <span className='loader p-2'>
    
              </span>
            ):(
                  'log in'
            )}
          </button>
        </form>

        {/* OR Separator */}
        <div className="flex items-center my-4">
          <hr className="flex-grow border-t" />
          <span className="mx-2 text-gray-500 text-sm">OR</span>
          <hr className="flex-grow border-t" />
        </div>

        {/* Social Buttons */}
        <div className="space-y-2">
          <button className="w-full border border-gray-300 rounded-md flex items-center justify-center py-2 gap-2 hover:bg-gray-50">
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/4f/Google_Logo.png" className="w-5 h-5" alt="Google" />
            Continue with Google
          </button>
          <button className="w-full border border-gray-300 rounded-md flex items-center justify-center py-2 gap-2 hover:bg-gray-50">
            <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" className="w-5 h-5" alt="Apple" />
            Continue with Apple
          </button>
        </div>

        {/* Footer */}
        <p className="text-center text-sm mt-6">

          New to phonefix?
          <Link to={'/Register'} >
           <a href="#" className="text-blue-600 hover:underline">Create a free account now</a>
           </Link>
        </p>
      </div>
    </div>
  )
}

export default AdminLogin 