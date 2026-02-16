import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { useGetProductByIdQueryQuery, useAddToCartMutation } from '../../../slices/userSlice';
import toast from "react-hot-toast";
import Header from './Header';

function ShowProduct() {
  const { id } = useParams();
  const { data: product, isLoading } = useGetProductByIdQueryQuery(id);
  const [addToCart, { isLoading: adding }] = useAddToCartMutation();
  const [mainImage, setMainImage] = useState('');

  const handleAddToCart = async () => {
    try {
      await addToCart({ productId: product._id, quantity: 1 }).unwrap();
      toast.success("Added to cart!");
    } catch (err) {
      toast.error("Failed to add");
    }
  };

  useEffect(() => {
    if (product?.images?.length > 0) {
      setMainImage(product.images[0].url);
    }
  }, [product]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="max-w-6xl mx-auto p-8 mt-10 animate-pulse flex flex-col md:flex-row gap-12">
          <div className="md:w-1/2 h-[450px] bg-gray-100 rounded-2xl"></div>
          <div className="md:w-1/2 space-y-6 py-4">
            <div className="h-10 bg-gray-100 rounded w-3/4"></div>
            <div className="h-24 bg-gray-100 rounded"></div>
            <div className="h-12 bg-gray-100 rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white min-h-screen pb-20 font-sans'>
      <Header />

      <div className="max-w-6xl mx-auto mt-8 p-4 md:p-8 flex flex-col md:flex-row gap-12">
        
        {/* LEFT: Image Gallery */}
        <div className="md:w-1/2 flex flex-col gap-4">
          <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center p-4">
            <img 
              src={mainImage} 
              alt={product?.name} 
              className="object-contain w-full h-[400px] hover:scale-105 transition-transform duration-300" 
            />
          </div>
          
          <div className="flex gap-3 overflow-x-auto pb-2">
            {product?.images?.map((img, index) => (
              <button
                key={index}
                onClick={() => setMainImage(img.url)}
                className={`flex-shrink-0 w-20 h-20 rounded-xl border-2 transition-all ${
                  mainImage === img.url ? "border-blue-900 ring-2 ring-blue-100" : "border-transparent hover:border-gray-200"
                } overflow-hidden bg-gray-50`}
              >
                <img src={img.url} className="w-full h-full object-cover" alt="thumb" />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: Product Info */}
        <div className="md:w-1/2 flex flex-col">
          <div className="border-b border-gray-100 pb-6">
            <nav className="text-[10px] text-blue-900 font-bold uppercase tracking-widest mb-2">
               Lobuy Certified Product
            </nav>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product?.name}</h1>
            
            {/* Indian Rating Style */}
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-blue-950 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                4.4 ★
              </span>
              <span className="text-sm text-gray-500 underline">24 Verified Reviews</span>
            </div>

            <p className="text-gray-600 leading-relaxed mb-6">{product?.description}</p>
            
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-extrabold text-blue-950">₹{product?.price}</span>
              <span className="text-lg text-gray-400 line-through font-medium">₹{Math.round(product?.price * 1.2)}</span>
            </div>
          
          </div>

          {/* Delivery & Trust - Indian Style */}
          <div className="py-6 grid grid-cols-2 gap-4">
            <div className="flex flex-col p-3 border rounded-xl bg-gray-50">
              <span className="text-sm font-bold text-gray-800">🚚 Delivery</span>
              <span className="text-xs text-gray-500">Free to your Pincode</span>
            </div>
            <div className="flex flex-col p-3 border rounded-xl bg-gray-50">
              <span className="text-sm font-bold text-gray-800">✅ Warranty</span>
              <span className="text-xs text-gray-500">6 Months PhoneFix Care</span>
            </div>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleAddToCart}
              disabled={adding}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all transform active:scale-95 shadow-lg ${
                adding ? "bg-gray-400 cursor-not-allowed" : "bg-blue-950 hover:bg-black text-white"
              }`}
            >
              {adding ? "Adding..." : "Add to Cart"}
            </button>
          </div>

          {/* Security Box */}
          <div className="mt-8 bg-slate-50 border border-slate-200 rounded-2xl p-6">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-3">
               🛡️ Lobuy Assurance
            </h3>
            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex items-center gap-2">✔ Secure Checkout (UPI/Cards Supported)</li>
              <li className="flex items-center gap-2">✔ 100% Original Indian Variant</li>
              <li className="flex items-center gap-2">✔ No hidden service charges</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShowProduct;