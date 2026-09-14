import User from '../Models/userModel.js';
import products from '../Models/productsModel.js';
import mongoose from 'mongoose';

export async function viewAllPublishedProducts(req, res){
    try{
        const{category,minPrice, maxPrice, sort, order, page, limit}=req.query;
        const filter={published:true};
        if(category)filter.category=category;
        if(minPrice||maxPrice){
            filter.price={};
            if(minPrice)filter.price.$gte=Number(minPrice);
            if(maxPrice)filter.price.$lte=Number(maxPrice);
        }
        const sortOrder = order === 'asc' ?1:-1;
        const allProducts = await products.find(filter)
        .sort({[sort]: sortOrder})
        .skip((page-1)*limit)
        .limit(parseInt(limit));
        const totalProducts=await products.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / limit);
        res.status(200).json({
            page:parseInt(page),
            limit:parseInt(limit),
            totalProducts,
            totalPages,
            allProducts
        }); 
    }
    catch(err){
        res.status(500).json({message:"Database error", error:err.message});
    }
}

export async function viewPublishedProduct(req,res){
    try{
        if(!mongoose.isValidObjectId(req.params.id)){
            return res.status(400).json({message:"Not a valid ID"});
        }
        const product=await products.findById({
            _id:req.params.id,
            published:true
        });
        if(!product){
            return res.status(404).json({message:"Product not found"});
        }
        res.status(200).json({message:"Product retrived",product});
    }
    catch(err){
        res.status(500).json({message:"Database error", error:err.message});
    }
}