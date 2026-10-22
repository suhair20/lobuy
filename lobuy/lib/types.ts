export type ProductImage = {
  url: string;
  public_id?: string;
};

export type Category = {
  _id: string;
  name: string;
  description?: string;
  is_list?: boolean;
};

export type Product = {
  _id: string;
  name: string;
  price: number;
  /** Original price; a discount is shown only when this is above `price`. */
  mrp?: number;
  /** Only present once a review system supplies real ratings. */
  rating?: number;
  numReviews?: number;
  stock: number;
  description?: string;
  sku?: string;
  images?: ProductImage[];
  category?: Category | string;
};

export type User = {
  _id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  isVerified?: boolean;
};

export type Address = {
  _id: string;
  fullName: string;
  phone: string;
  addressLine: string;
  city: string;
  state?: string;
  district?: string;
  pincode: string;
  landmark?: string;
  type?: string;
};

export type CartProduct = {
  _id: string;
  productId: Product;
  quantity: number;
  price: number;
  totalPrice?: number;
};

export type Cart = {
  _id?: string;
  products: CartProduct[];
};

export type Order = {
  _id: string;
  products: CartProduct[];
  subtotal: number;
  orderStatus: string;
  payment?: string;
  createdAt: string;
  updatedAt: string;
  delivery_address: Address;
};
