import express from 'express'
const userRoute=express.Router()
import * as usercontroller from '../controllers/UserController.js';
import * as UserCheckAuth from '../middleware/UserCheckAuth.js'





userRoute.post('/register',usercontroller.registration)
userRoute.post('/verifyotp',usercontroller.verifyotp)
userRoute.get('/UserCheckAuth',UserCheckAuth.UserCheckAuth,usercontroller.checkAuth)
userRoute.post('/login',usercontroller.login)
userRoute.post('/addaddress',UserCheckAuth.UserCheckAuth,usercontroller.addAddress)
userRoute.get('/get-address',UserCheckAuth.UserCheckAuth,usercontroller.getAddress)
userRoute.get('/products/latest',usercontroller.getLatestProducts)
userRoute.get('/productbyId/:id',usercontroller.getproductById)
userRoute.get('/categories',usercontroller.getcategories)
userRoute.get('/productbycategory/:id',usercontroller.productbycategory)
userRoute.post('/cart/add',UserCheckAuth.UserCheckAuth,usercontroller.addToCart)
userRoute.get('/cart',UserCheckAuth.UserCheckAuth,usercontroller.getCart)
userRoute.put('/cart/update',UserCheckAuth.UserCheckAuth,usercontroller.updateCart)
userRoute.delete('/cart/remove/:productId',UserCheckAuth.UserCheckAuth,usercontroller.removeFromCart)
userRoute.post('/orders',UserCheckAuth.UserCheckAuth,usercontroller.placeOrder)
userRoute.post('/orders/verify',UserCheckAuth.UserCheckAuth,usercontroller.verifyPayment)
userRoute.get('/my-orders',UserCheckAuth.UserCheckAuth,usercontroller.getOrders)
userRoute.get('/orders-deatials/:id',UserCheckAuth.UserCheckAuth,usercontroller.getOrderDetails)
userRoute.patch('/orders/:id/cancel',UserCheckAuth.UserCheckAuth,usercontroller.cancelOrder)
userRoute.post('/logout',UserCheckAuth.UserCheckAuth,usercontroller.logout)






export default userRoute