import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const { isAuthenticated } = useSelector((state) => state.adminAuth);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      {/* 1. Sidebar: Usually handled with 'hidden md:block' inside Sidebar.js or here */}
      <div className="hidden md:block">
       <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      </div>

      <Navbar />

      {/* 2. Content Area */}
      {/* Changed 'ml-64' to 'md:ml-64' so it only pushes on Desktop */}
      {/* Changed 'w-full' to 'w-full' but added overflow handling */}
      <div className={`${isAuthenticated ? "md:ml-64" : "ml-0"} mt-16 p-4 md:p-8 space-y-6 transition-all duration-300`}>

        {/* 3. Cards Section: 1 column on mobile, 2 on tablet, 4 on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-white shadow rounded p-6">
            <h4 className="text-sm text-gray-500 font-medium">Total Orders</h4>
            <p className="text-2xl font-bold mt-2">1,245</p>
          </div>
          <div className="bg-white shadow rounded p-6">
            <h4 className="text-sm text-gray-500 font-medium">Total Sales</h4>
            <p className="text-2xl font-bold mt-2">₹8,50,000</p>
          </div>
          <div className="bg-white shadow rounded p-6">
            <h4 className="text-sm text-gray-500 font-medium">Users</h4>
            <p className="text-2xl font-bold mt-2">532</p>
          </div>
          <div className="bg-white shadow rounded p-6">
            <h4 className="text-sm text-gray-500 font-medium">Products</h4>
            <p className="text-2xl font-bold mt-2">350</p>
          </div>
        </div>

        {/* 4. Recent Products Table: Added 'overflow-x-auto' wrapper */}
        <div className="bg-white shadow rounded p-4 md:p-6">
          <h3 className="text-lg font-bold mb-4">Recent Products</h3>
          
          <div className="overflow-x-auto border border-gray-200 rounded">
            <table className="w-full text-left min-w-[600px]">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="p-3 border-b">Image</th>
                  <th className="p-3 border-b">Name</th>
                  <th className="p-3 border-b">Category</th>
                  <th className="p-3 border-b">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="p-3"><img src="https://via.placeholder.com/50" alt="Product" className="rounded" /></td>
                  <td className="p-3 font-medium">iPhone 15 Pro</td>
                  <td className="p-3 text-gray-600">Mobiles</td>
                  <td className="p-3 font-semibold text-gray-900">₹1,20,000</td>
                </tr>
                <tr>
                  <td className="p-3"><img src="https://via.placeholder.com/50" alt="Product" className="rounded" /></td>
                  <td className="p-3 font-medium">Samsung S23</td>
                  <td className="p-3 text-gray-600">Mobiles</td>
                  <td className="p-3 font-semibold text-gray-900">₹90,000</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs text-gray-400 block md:hidden">Scroll horizontally to view full table →</p>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
