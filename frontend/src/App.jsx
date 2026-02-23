  import React, { useState, useEffect } from "react";
  import './App.css'
  import {Outlet} from 'react-router-dom'
  import Intropage from "./components/User/Intropage"
  import { useDispatch } from "react-redux";
  import {Toaster}from 'react-hot-toast'
  import { useGetLatestProductsQuery,useCheckAuthQuery } from "../slices/userSlice";
  import { setauthenticated,logout } from "../slices/AuthSlice";


 function App() {
  const dispatch = useDispatch();
  
  // 1. Get auth status
  const { data, error, isLoading } = useCheckAuthQuery();
  
  // 2. ONLY fetch products once auth is determined (prevents network congestion)
  useGetLatestProductsQuery(8, { skip: isLoading });

  // 3. State for the intro
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    if (data) dispatch(setauthenticated(data.user));
    if (error) dispatch(logout());
  }, [data, error, dispatch]);

  // 4. Auto-hide intro when data is ready OR after a fallback timer
  useEffect(() => {
    if (!isLoading) {
      // Small delay so the user actually sees the intro, but not 18 seconds!
      const timer = setTimeout(() => setShowIntro(false), 2000); 
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <div>
      <Toaster position="bottom-center" />
      {/* Remove the Intropage from the DOM entirely when showIntro is false 
          to free up GPU memory */}
      {showIntro ? <Intropage /> : <Outlet />}
    </div>
  );
}

  export default App
