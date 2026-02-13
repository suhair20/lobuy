import React, { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';
import { 
  useGetAddressQuery, 
  useGetCartQuery, 
  useCreateOrderMutation, 
  useVerifyPaymentMutation // Add this to your slices/userSlice
} from '../../../slices/userSlice';
import { log } from 'three';

function Checkout() {
  const navigate = useNavigate();

  // 1. Data Fetching & Mutations
  const { data: cart, isLoading: cartLoading } = useGetCartQuery();
  const { data: addressData, isLoading: addressLoading } = useGetAddressQuery();
  const [createOrder, { isLoading: isCreating }] = useCreateOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();

  const cartItems = cart?.products || [];
  const savedAddresses = addressData?.addresses || [];

  // 2. State Management
  const [useSavedAddress, setUseSavedAddress] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [newAddress, setNewAddress] = useState({
    fullName: '',
    phone: '',
    addressLine: '',
    city: '',
    state: '',
    pincode: '',
    type: 'Home',
  });

  useEffect(() => {
    if (savedAddresses.length > 0) {
      setSelectedAddressId(savedAddresses[0]._id);
    } else {
      setUseSavedAddress(false);
    }
  }, [savedAddresses]);

  // 3. Handlers
  const handleNewAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  const total = cartItems.reduce((sum, item) => sum + (item.totalPrice || (item.price * item.quantity)), 0);






  const handlePayment = async () => {
    const finalAddress = useSavedAddress 
      ? savedAddresses.find(a => a._id === selectedAddressId)
      : newAddress;
    
   
    if (useSavedAddress && !selectedAddressId) return alert("Please select an address");
    if (!useSavedAddress && (!newAddress.fullName || !newAddress.phone || !newAddress.addressLine)) {
        return alert("Please fill in all address details");
    }

    try {
     
      const orderPayload = { 
        shippingAddress: finalAddress, 
        items: cartItems, 
        totalAmount: total 
      };

      const orderResponse = await createOrder(orderPayload).unwrap();

      console.log("order",orderResponse);
      
      const options = {
        key: "rzp_test_SFfiR2Bv917uzp", 
        amount: orderResponse.amount,   
        currency: "INR",
        name: "LOBUY",
        description: "Order Payment",
        order_id: orderResponse.razorpayOrderId,
        handler: async function (response) {
          try {
            
            const verificationData = {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            };

            const result = await verifyPayment(verificationData).unwrap();
            
            if (result.success) {
              navigate(`/order-success/${orderResponse.orderId}`);
            }
          } catch (err) {
            alert("Payment verification failed: " + err.data?.message);
          }
        },
        prefill: {
          name: finalAddress.fullName,
          contact: finalAddress.phone,
        },
        theme: {
          color: "#1e3a8a", // Matches blue-900
        },
        modal: {
            ondismiss: function() {
                alert("Payment cancelled by user.");
            }
        }
      };

      // Step 4: Open the Razorpay Modal
      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.log(err);
      
      alert("Error initializing order: " + (err.data?.message || err.message));
    }   
  };

  if (cartLoading || addressLoading) return (
    <div className="h-screen flex items-center justify-center font-semibold text-gray-500">
        Processing Checkout Data...
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen">
    <Header minimal={true} />
      
      <div className="max-w-7xl mx-auto p-4 md:p-10 grid lg:grid-cols-3 gap-10">
        
        {/* LEFT & CENTER: ADDRESS SELECTION */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center gap-4">
            <span className="bg-blue-900 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">1</span>
            <h2 className="text-2xl font-bold text-gray-800">Delivery Address</h2>
          </div>

          {/* SECTION 1: SAVED ADDRESSES */}
          {savedAddresses.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <label className="flex items-center gap-3 mb-4 cursor-pointer group">
                <input 
                  type="radio" 
                  className="w-5 h-5 accent-blue-900"
                  checked={useSavedAddress} 
                  onChange={() => setUseSavedAddress(true)} 
                />
                <span className="font-bold text-lg group-hover:text-blue-900 transition-colors">
                  Select a Saved Address
                </span>
              </label>

              {useSavedAddress && (
                <div className="grid md:grid-cols-2 gap-4 mt-4 animate-in slide-in-from-top-2 duration-300">
                  {savedAddresses.map((addr) => (
                    <div 
                      key={addr._id} 
                      onClick={() => setSelectedAddressId(addr._id)}
                      className={`p-4 border-2 rounded-xl cursor-pointer transition-all relative ${
                        selectedAddressId === addr._id 
                        ? 'border-blue-900 bg-blue-50/50 ring-1 ring-blue-900' 
                        : 'border-gray-100 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-gray-200 rounded text-gray-600">
                          {addr.type}
                        </span>
                        {selectedAddressId === addr._id && (
                          <div className="bg-blue-900 text-white rounded-full p-0.5">
                             <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                             </svg>
                          </div>
                        )}
                      </div>
                      <p className="font-bold text-gray-900">{addr.fullName}</p>
                      <p className="text-sm text-gray-600 mt-1">{addr.addressLine}</p>
                      <p className="text-sm text-gray-600">{addr.city}, {addr.state} - {addr.pincode}</p>
                      <p className="text-sm font-semibold mt-2 text-gray-800">📞 {addr.phone}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SECTION 2: NEW ADDRESS FORM */}
          <div className={`bg-white p-6 rounded-xl shadow-sm border transition-all ${!useSavedAddress ? 'border-blue-900 ring-1 ring-blue-900' : 'border-gray-100'}`}>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="radio" 
                className="w-5 h-5 accent-blue-900"
                checked={!useSavedAddress} 
                onChange={() => setUseSavedAddress(false)} 
              />
              <span className="font-bold text-lg group-hover:text-blue-900 transition-colors">
                Add a New Address
              </span>
            </label>

            {!useSavedAddress && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 animate-in fade-in duration-500">
                <input type="text" name="fullName" value={newAddress.fullName} onChange={handleNewAddressChange} placeholder="Full Name" className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-900 outline-none" />
                <input type="text" name="phone" value={newAddress.phone} onChange={handleNewAddressChange} placeholder="10-digit mobile number" className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-900 outline-none" />
                <input type="text" name="addressLine" value={newAddress.addressLine} onChange={handleNewAddressChange} placeholder="Address (Area and Street)" className="border p-3 rounded-lg w-full md:col-span-2 focus:ring-2 focus:ring-blue-900 outline-none" />
                <input type="text" name="city" value={newAddress.city} onChange={handleNewAddressChange} placeholder="City/District/Town" className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-900 outline-none" />
                <input type="text" name="pincode" value={newAddress.pincode} onChange={handleNewAddressChange} placeholder="Pincode" className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-900 outline-none" />
                <input type="text" name="state" value={newAddress.state} onChange={handleNewAddressChange} placeholder="State" className="border p-3 rounded-lg w-full focus:ring-2 focus:ring-blue-900 outline-none" />
                
                <div className="flex gap-6 items-center md:col-span-2 p-2">
                  <span className="text-sm font-semibold text-gray-500 uppercase">Address Type:</span>
                  <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                    <input type="radio" name="type" value="Home" checked={newAddress.type === 'Home'} onChange={handleNewAddressChange} className="accent-blue-900" /> Home
                  </label>
                  <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                    <input type="radio" name="type" value="Work" checked={newAddress.type === 'Work'} onChange={handleNewAddressChange} className="accent-blue-900" /> Work
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: ORDER SUMMARY */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xl sticky top-24">
            <h2 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2">
                Order Summary
                <span className="text-sm font-normal text-gray-400">({cartItems.length} Items)</span>
            </h2>
            
            <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
              {cartItems.map((item) => (
                <div key={item._id} className="flex gap-4 group">
                  <div className="relative overflow-hidden rounded-lg bg-gray-100 w-20 h-20 flex-shrink-0">
                    <img 
                      src={item.productId?.images?.[0]?.url} 
                      alt={item.productId?.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-center">
                    <p className="font-bold text-gray-800 text-sm line-clamp-1">{item.productId?.name}</p>
                    <p className="text-xs text-gray-400 mt-1">Quantity: {item.quantity}</p>
                    <p className="font-black text-blue-900 mt-1">₹{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-dashed border-gray-200 space-y-3">
                <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span>₹{total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-green-600 text-sm">
                    <span>Delivery Charges</span>
                    <span className="font-bold">FREE</span>
                </div>
                <div className="flex justify-between text-xl font-black text-gray-900 pt-2">
                    <span>Total Amount</span>
                    <span>₹{total.toLocaleString()}</span>
                </div>
            </div>

            <button 
              onClick={handlePayment}
              disabled={isCreating}
              className="w-full mt-8 bg-blue-900 text-white py-4 rounded-xl font-black tracking-widest hover:bg-blue-800 hover:shadow-lg active:scale-95 transition-all disabled:bg-gray-400"
            >
              {isCreating ? "PROCESSING..." : "PROCEED TO PAYMENT"}
            </button>
            
            <p className="text-[10px] text-center text-gray-400 mt-4 px-4">
                By clicking proceed, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>

      </div>
      <Footer />
    </div>
  );
}

export default Checkout;