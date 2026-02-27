// Admin login controller
import bcrypt from 'bcrypt'
import User from '../models/userModel.js';
import Jwt from '../Services/jwt.js';
import jwt from '../Services/jwt.js';
import CategoryModel from '../models/CategoryModel.js';
import cloudinary from '../config/cloudinary.js';
import Product from '../models/product.Model.js'


export const adminlogin =async (req, res)=> {

  console.log("loginn com ");
  
  const { email, Password } = req.body;

  const admin = await User.findOne({ email });

  if (!admin) return res.status(400).json({ message: "User not found" });
  if (!admin.isAdmin)
    return res.status(403).json({ message: "Not allowed" });

  const isMatch = await bcrypt.compare(Password, admin.Password);
  if (!isMatch) return res.status(400).json({ message: "Invalid password" });

const token = jwt.genrateToken({
  id: admin._id,
  isAdmin: admin.isAdmin,
});

  res.cookie("adminToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

  return res.json({ message: "Admin login success",admin});
}



export const checkAuth =async (req,res)=>{
  
  console.log("heloocomadmin");
  
   return res.json({
    success: true,
    user: req.admin,
  });
}


export const addCategory=async(req,res)=>{
  try {
     const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).json({ message: "All fields required" });
  }

  const exists = await CategoryModel.findOne({ name });

  if (exists) {
    return res.status(409).json({ message: "Category already exists" });
  }

  const category = await CategoryModel.create({
    name,
    description,
  });

  res.status(201).json({
    success: true,
    category,
  });
  } catch (error) {
     console.log(error);
     
  }
}





export const getcategories =async (req,res)=>{
  try {
    console.log('heloocomdo');
    
 const categories = await CategoryModel.find().sort({ createdAt: -1 });
  res.json({ success: true, categories });

  } catch (error) {
    console.log(error);
    
  }
}



export const toggleCategory = async (req, res) => {

  try {
     
  const category = await CategoryModel.findById(req.params.id);
  category.is_list = !category.is_list;
  await category.save();
  res.json({ success: true });

  
  } catch (error) {
    console.log(error);
    
  }

};










export const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Images are required" });
    }

 
    const images= [];

    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(
        `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
        {
          folder: "products",
        }
      );
      images.push({
        url: result.secure_url,
        public_id: result.public_id,
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      category,
      stock,
      images: images,
    });

    res.status(201).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Add product error:", error);
    res.status(500).json({ message: "Server error" });
  }
};



export const getProducts = async (req, res) => {
  try {

    console.log("heloo");
    
    const products = await Product.find()
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ message: "Server error" });
  }
};



export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const {
      name,
      description,
      price,
      category,
      stock,
      imageIndexes,
    } = req.body;

    // update fields safely
    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.price = price ?? product.price;
    product.category = category ?? product.category;
    product.stock = stock ?? product.stock;

    // 🔥 PARTIAL IMAGE UPDATE
    if (req.files && req.files.length > 0) {
      const indexes = Array.isArray(imageIndexes)
        ? imageIndexes
        : [imageIndexes];

      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const index = Number(indexes[i]);

        // delete old image at index
        if (product.images[index]?.public_id) {
          await cloudinary.uploader.destroy(
            product.images[index].public_id
          );
        }

        // upload new image
        const result = await cloudinary.uploader.upload(
          `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
          { folder: "products" }
        );

        // replace only that image
        product.images[index] = {
          url: result.secure_url,
          public_id: result.public_id,
        };
      }
    }

    await product.save();
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const editproduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 🔥 delete images from cloudinary
    for (const img of product.images) {
      if (img.public_id) {
        await cloudinary.uploader.destroy(img.public_id);
      }
    }

    // 🗑 delete product from DB
    await product.deleteOne();

    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
