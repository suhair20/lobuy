import { Route } from "react-router-dom";
import UserHomeScreen from "../components/User/UserHomeScreen";
import UserProductScreen from "../components/User/UserProductScreen";
import ShowProduct from "../components/User/ShowProduct";
import UserLoginScreen from "../components/User/UserLoginScreen";
import UserRegister from "../components/User/UserRegister";
import CartPage from "../components/User/CartPage";
import Checkout from "../components/User/Checkout";
import Profile from "../components/User/Profile";
import Orders from "../components/User/Orders";
import ProtectedRoute from "./ProtectedRoute";
import OrderDetials from "../components/User/OrderDetials";
import ContactScreen from "../components/User/ContactScreen";
import OrderSuccess from "../components/User/OrderSuccess";
const UserRoutes=(
   <>
    {/* --- PUBLIC ROUTES --- */}
    <Route path="/" element={<UserHomeScreen />} />
    <Route path="/shop/:categoryId" element={<UserProductScreen />} />
    <Route path="/product/:id" element={<ShowProduct />} />
    <Route path="/login" element={<UserLoginScreen />} />
    <Route path="/Register" element={<UserRegister />} />
    <Route path="/contact" element={<ContactScreen />} />
    
    {/* --- PRIVATE ROUTES (Only for logged-in users) --- */}
    <Route element={<ProtectedRoute />}>
      <Route path="/profile" element={<Profile />} />
      <Route path="/Cart" element={<CartPage />} />
      <Route path="/Checkout" element={<Checkout />} />
      <Route path="/Orders" element={<Orders />} />
      <Route path="/Orderdetials/:id" element={<OrderDetials />} />
      <Route path="/order-success/:id" element={<OrderSuccess />} />
    </Route>
  </>

)


export default UserRoutes