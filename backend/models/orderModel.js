import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true
  },
  delivery_address: {
    type: Object, 
    required: true
  },
  payment: {
    type: String,
    required: true,
   
    enum: ['Cash on delivery', 'Razorpay', 'Wallet'] 
  },
  
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  
  products: [{
      productId: {
        type: mongoose.Types.ObjectId,
        ref: 'productModel',
        required: true
      },
      quantity: {
        type: Number,
        required: true
      },
      price: {
        type: Number,
        required: true
      },
      totalPrice: {
      type: Number, 
      default: 0
    },  
    productStatus:{
        type: String,
        default: 'placed',
        enum: ['pending','placed', 'delivered', 'cancelled', 'shipped','out-for-delivery','returned']
      },
    cancelReason: { type: String },
    returnReason: { type: String }
  }],
  subtotal: {
    type: Number,
    required: true
  },
 orderStatus: {
  type: String,
  default: 'pending',

  enum: ['pending', 'placed', 'shipped', 'out-for-delivery', 'delivered', 'cancelled', 'returned or cancelled', 'Paid'] 
},
  orderDate: {
    type: Date,
    default: Date.now 
  },
  wallet: { type: Number },
  cancelledProduct: { type: Array, default: [] },
  returnedProduct: { type: Array, default: [] }
}, { timestamps: true });

const Order = mongoose.model('Orders', orderSchema);


export default Order;