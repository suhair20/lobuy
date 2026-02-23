  import React, { useState, useEffect } from "react";
  import './App.css'
  import {Outlet} from 'react-router-dom'
  import Intropage from "./components/User/Intropage"
  import { useDispatch } from "react-redux";
  import {Toaster}from 'react-hot-toast'
  import { useGetLatestProductsQuery,useCheckAuthQuery } from "../slices/userSlice";
  import { setauthenticated,logout } from "../slices/AuthSlice";


function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [introMinTimeMet, setIntroMinTimeMet] = useState(false);
  const dispatch = useDispatch();


  const { data, error, isLoading: authLoading } = useCheckAuthQuery();
  

  useGetLatestProductsQuery(8, { skip: authLoading });

  useEffect(() => {
    const timer = setTimeout(() => {
      setIntroMinTimeMet(true);
    }, 6000); 

    return () => clearTimeout(timer);
  }, []);


  useEffect(() => {
    if (data) dispatch(setauthenticated(data.user));
    if (error) dispatch(logout());
  }, [data, error, dispatch]);

  useEffect(() => {
    if (introMinTimeMet && !authLoading) {
      setShowIntro(false);
    }
  }, [introMinTimeMet, authLoading]);

  return (
    <div>
      <Toaster position="bottom-center" />
      
      {showIntro ? <Intropage /> : <Outlet />}
    </div>
  );
}
  export default App
