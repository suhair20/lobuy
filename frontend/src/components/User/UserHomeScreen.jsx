import React from 'react'
import Header from './Header'
import Footer from './Footer';
import { HomeIcon } from '@heroicons/react/24/solid';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'; // Required core styles
import 'swiper/css/autoplay';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Star, Users, ShieldCheck, Store } from 'lucide-react';
import { Link, useLocation } from "react-router-dom";

import { Autoplay, Navigation, Pagination } from 'swiper/modules';

import image from '../../assets/OIP.jpeg';

import image2 from '../../assets/watch.png';
import image3 from '../../assets/headset.png'
import image4 from '../../assets/earrrrpod.png'
import image5 from '../../assets/earpod.png'
import { useGetLatestProductsQuery } from '../../../slices/userSlice';

function UserHomeScreen() {
  
const { data, isLoading } = useGetLatestProductsQuery(8);

const products = Array.isArray(data) ? data : data?.products || [];
const sliderProducts = products.length ? [...products, ...products] : [];
console.log("API DATA:", data);
  return (
    <>
    <div className='   ' >
      <Header/>
<div className='  bg-[#fefffdd8] '>
   

   
    <div  className='  bg-gradient-to-tr from-blue-950 via-black to-blue-950'>
      <div></div>

 <h1 className="absolute text-[70px] whitespace-nowrap md:top-[40%] left-1/2 -translate-x-1/2 mt-28 -translate-y-1/2 md:text-[150px] font-extrabold text-white opacity-80 z-0 font-serif   pointer-events-none">
        LOBUY
    </h1>

     <div className="relative z-10 w-full px-4 overflow-hidden">
          <div className="w-full overflow-x-auto scroll-smooth hide-scrollbar snap-x snap-mandatory">
            <div className="flex w-max gap-6 md:gap-12 py-10 animate-slide hover:[animation-play-state:paused]">
              
              {isLoading && (
                <div className="flex gap-6">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="w-44 md:w-64 h-72 bg-gray-800 animate-pulse rounded-2xl" />
                  ))}
                </div>
              )}

              {!isLoading && sliderProducts.map((product, index) => (
                <div
                  key={index}
                  className="group relative h-72 w-48 md:h-96 md:w-64 p-4 rounded-2xl bg-gray-900/80 backdrop-blur-sm border border-white/10 text-white cursor-pointer transition-all duration-300 hover:bg-gray-800 snap-center"
                >
                  {/* Stock Tag */}
                  <div className="absolute top-3 left-3 z-20 bg-[#5c3c2d] text-[10px] md:text-xs text-[#f0c590] px-2 py-1 rounded-full uppercase font-bold">
                    Limited to {product.stock}
                  </div>

                  <Link to={`/product/${product._id}`} className="block h-full flex flex-col">
                    {/* Image Container */}
                    <div className="flex-1 flex items-center justify-center p-4">
                      <img
                        src={product.images?.[0]?.url}
                        alt={product.name}
                        className="max-w-60 max-h-40 md:max-h-56 object-contain group-hover:scale-110 transition-transform duration-500 ease-out"
                      />
                    </div>

                    {/* Info Container - Removed absolute to prevent overlap */}
                    <div className="mt-2 space-y-1">
                      <p className="text-sm md:text-lg font-medium truncate">
                        {product.name}
                      </p>
                      <p className="text-blue-400 font-bold text-lg">
                        ₹{product.price.toLocaleString()}
                      </p>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      
    </div>
  <div className="py-10 px-6 md:px-36">
        <h2 className="text-2xl md:text-3xl font-poppins mb-8">POPULAR BRAND</h2>
        <div className="flex flex-col gap-4">
          {[1, 2].map((row) => (
            <div key={row} className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
              {["ROLEX", "G-SHOCK", "HUBLOT", "KDM", "POPUP", "TIOX"].map((brand) => (
                <div key={brand} className="min-w-[140px] md:flex-1 h-12 flex items-center justify-center bg-slate-200 hover:bg-blue-500 hover:text-white transition-colors cursor-pointer rounded-lg font-normal">
                  {brand}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>






<div className="bg-[#fefffdd8] py-16 mt-12 px-6 md:px-36  text-center">
  <h2 className="text-3xl font-bold mb-10">Why People Trust Us</h2>

  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-10 text-gray-700">
    <div className=' border border-gray-500 hover:border-blue-600 cursor-pointer h-36 flex flex-col items-center justify-center  rounded-lg ' >
      <Star className="w-10 h-10 text-blue-400 mb-2" />
      <h3 className="md:text-4xl font-bold text-black">4.8 / 5</h3>
      <p className="mt-2">Average Customer Rating</p>
    </div>

    <div className=' border border-gray-500  hover:border-blue-600 h-36 flex cursor-pointer flex-col items-center justify-center  rounded-lg ' >
        <Users className="w-10 h-10 text-blue-500 mb-2" />
      <h3 className="md:text-4xl font-bold text-black">50,000+</h3>
      <p className="mt-2">Monthly Visitors</p>
    </div>

    <div className=' border border-gray-400  cursor-pointer hover:border-blue-600  h-36 flex flex-col items-center justify-center  rounded-lg ' >
      <ShieldCheck className="w-10 h-10 text-blue-500 mb-2" />
      <h3 className="md:text-4xl font-bold text-black">100%</h3>
      <p className="mt-2">Buyer Protection Guaranteed</p>
    </div>

 <div className=' border border-gray-400 cursor-pointer hover:border-blue-600 h-36 flex flex-col items-center justify-center  rounded-lg ' >
     <Store className="w-10 h-10 text-blue-500 mb-2" />
      <h3 className="md:text-4xl font-bold text-black">1,200+</h3>
      <p className="mt-2">Trusted Sellers</p>
    </div>
  </div>
</div>




<div className="bg-[#fefffdd8] py-16 mt-12 px-6 md:px-36  ">
  <h2 className="text-3xl font-bold mb-10">Explore phonefix</h2>

  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-10 text-gray-700">
    <div>
    <div className=' border border-gray-500 hover:border-blue-600 cursor-pointer h-56 flex flex-col items-center justify-center  rounded-lg ' >
     <img
         src={image5}
         alt="Watch"
           className="md:w-44 w-24 rotate-[35deg] scale-110   group-hover:scale-125 group-focus:scale-125 transition-transform duration-500 ease-in-out "
        />
      
    </div>
    <p className="mt-2 text-center">Average Customer Rating</p>
    </div>
    
 <div>
    <div className=' border border-gray-500  hover:border-blue-600 h-56 flex cursor-pointer flex-col items-center justify-center  rounded-lg ' >
         <img
         src={image4}
         alt="Watch"
           className="md:w-44 w-24 rotate-[35deg] scale-110   group-hover:scale-125 group-focus:scale-125 transition-transform duration-500 ease-in-out "
        />
      
    </div>
    <p className="mt-2 text-center ">Monthly Visitors</p>
    </div>

<div>
    <div className=' border border-gray-400  cursor-pointer hover:border-blue-600  h-56  flex flex-col items-center justify-center  rounded-lg ' >
      <img
         src={image3}
         alt="Watch"
           className="md:w-44 w-24 rotate-[35deg] scale-110   group-hover:scale-125 group-focus:scale-125 transition-transform duration-500 ease-in-out "
        />
      
    </div>
    <p className="mt-2 text-center ">Buyer Protection Guaranteed</p>
    </div>


<div>
    <div className=' border border-gray-400  cursor-pointer hover:border-blue-600  h-56  flex flex-col items-center justify-center  rounded-lg ' >
      <img
         src={image2}
         alt="Watch"
           className="md:w-44 w-24 rotate-[35deg] scale-110   group-hover:scale-125 group-focus:scale-125 transition-transform duration-500 ease-in-out "
        />
      
    </div>
    <p className="mt-2 text-center ">Buyer Protection Guaranteed</p>
    </div>


    <div>
    <div className=' border border-gray-400  cursor-pointer hover:border-blue-600  h-56  flex flex-col items-center justify-center  rounded-lg ' >
      <img
         src={image3}
         alt="Watch"
           className="md:w-44 w-24 rotate-[35deg] scale-110   group-hover:scale-125 group-focus:scale-125 transition-transform duration-500 ease-in-out "
        />
      
    </div>
    <p className="mt-2 text-center ">Buyer Protection Guaranteed</p>
    </div>


   <div>
    <div className=' border border-gray-400  cursor-pointer hover:border-blue-600  h-56  flex flex-col items-center justify-center  rounded-lg ' >
      <img
         src={image2}
         alt="Watch"
           className="md:w-44 w-24 rotate-[35deg] scale-110   group-hover:scale-125 group-focus:scale-125 transition-transform duration-500 ease-in-out "
        />
      
    </div>
    <p className="mt-2 text-center ">Buyer Protection Guaranteed</p>
    </div>


   <div>
    <div className=' border border-gray-400  cursor-pointer hover:border-blue-600  h-56  flex flex-col items-center justify-center  rounded-lg ' >
      <img
         src={image3}
         alt="Watch"
           className="md:w-44 w-24 rotate-[35deg] scale-110   group-hover:scale-125 group-focus:scale-125 transition-transform duration-500 ease-in-out "
        />
      
    </div>
    <p className="mt-2 text-center ">Buyer Protection Guaranteed</p>
    </div>

   <div>
    <div className=' border border-gray-400  cursor-pointer hover:border-blue-600  h-56  flex flex-col items-center justify-center  rounded-lg ' >
      <img
         src={image3}
         alt="Watch"
           className="md:w-44 w-24 rotate-[35deg] scale-110   group-hover:scale-125 group-focus:scale-125 transition-transform duration-500 ease-in-out "
        />
      
    </div>
    <p className="mt-2 text-center ">Buyer Protection Guaranteed</p>
    </div>
  </div>
</div>









</div>
      
   
    </div>
     <Footer/>
    </>
  )
}

export default UserHomeScreen
