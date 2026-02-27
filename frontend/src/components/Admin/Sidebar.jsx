import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { adminLogout } from "../../../slices/AdminAuth"; // Adjust this path to your actual slice
import { 
  FaTachometerAlt, 
  FaBox, 
  FaTags, 
  FaUsers, 
  FaChartBar, 
  FaImage, 
  FaSignOutAlt 
} from "react-icons/fa";

function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    // 1. Clear Redux State
    dispatch(adminLogout()); 
    // 2. Optional: Redirect to login page
    navigate("/admin/login");
  };

  return (
    <div className="w-52 shadow-md h-screen bg-gradient-to-tr from-blue-950 via-black to-blue-950 text-white fixed flex flex-col justify-between">
      
      <nav className="mt-6">
        <div className="px-6 mb-6">
           <h2 className="text-xl font-bold tracking-wider text-blue-400">LoBuy</h2>
        </div>
        <ul>
          <li className="p-4 hover:bg-gray-700 flex items-center gap-3">
            <FaTachometerAlt /><Link to="/admin">Dashboard</Link>
          </li>
          <li className="p-4 hover:bg-gray-700 flex items-center gap-3">
            <FaBox /><Link to="/admin/products">Products</Link>
          </li>
          <li className="p-4 hover:bg-gray-700 flex items-center gap-3">
            <FaTags /><Link to="/admin/category">Categories</Link>
          </li>
          <li className="p-4 hover:bg-gray-700 flex items-center gap-3">
            <FaImage /><Link to="/admin/Banner">Banners</Link>
          </li>
          <li className="p-4 hover:bg-gray-700 flex items-center gap-3">
            <FaUsers /><Link to="/admin/users">Users</Link>
          </li>
          <li className="p-4 hover:bg-gray-700 flex items-center gap-3">
            <FaChartBar /><Link to="/admin/reports">Reports</Link>
          </li>
        </ul>
      </nav>

      {/* Logout Button at the Bottom */}
      <div className="mb-6 border-t border-gray-700">
        <button 
          onClick={handleLogout}
          className="w-full p-4 hover:bg-red-600 flex items-center gap-3 transition-colors duration-200 text-red-400 hover:text-white"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>

    </div>
  );
}

export default Sidebar;


