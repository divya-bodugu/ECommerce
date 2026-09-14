import mongoose from "mongoose";
import User from "../Models/userModel.js";
import products from "../Models/productsModel.js";
import { Parser } from "json2csv";

import csv from 'csv-parser';
import { Readable } from 'stream';
import { upload } from '../utilis/csvUtilis.js';

export const createProduct = async ( req, res ) => {
    try {
        const { name, description, price, category, stock, published } = req.body;
        if( req.user.role !== "admin" ) {
            return res.status(400).json({
            message : "You are not authorized",
        });
        }
        const product = await products.create({
             name,
             description,
             price,
             category,
             stock,
             published
        });
        return res.status(201).json({
            message : "Product Created",
            productDetails : product 
        });
    } catch (err) {
        return res.status(400).json({
            message : "DB Error",
            error : err
        });
    }
}

export const getAllProducts = async ( req, res ) => {
    try {
        const { published, exportData } =req.query;
        const filter={}
        if (published !== undefined) {
            filter.published = published === 'true';
        }
        if( req.user.role === "user" ) {
            const product = await products.find({ published : true });
            return res.status(200).json( product );
        }
        if( req.user.role === "admin" && exportData === "csv" ) {
            const product = await products.find().lean();
            const jsonToCsv = new Parser({
                fields : [ "_id", "name", "description", "price", "category", "stock", "published"]
            });
            const csvData = jsonToCsv.parse(product);
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename = products-data.csv')
            return res.status(200).send( csvData );
        }
        if( req.user.role === "admin"  ) {
            const product = await products.find(filter);
            return res.status(200).json( product );
        }
    } catch (err) {
        return res.status(400).json({
            message : "DB Error",
            error : err
        });       
    }
}

export const getProductById = async (req, res) => {
    try {
        if( !mongoose.isValidObjectId(req.params.id) ){
            return res.status(400).json({
                message : "Invalid Object Id"
            });
        }
        const product = await products.findById( req.params.id );
        if( !product ) {
            return res.status(400).json({
                message : "No product found"
            })
        }
        return res.status(200).json(product);
        
    } catch (err) {
        return res.status(400).json({
            message : "DB Error",
            error : err.message
        });  
    }
}

export const updateProductById = async ( req, res ) => {
    try {
        if(!mongoose.isValidObjectId(req.params.id)){
            return res.status(400).json({
                message : "Invalid object id"
            });
        }
        const changes = {};
        if( req.body.name !== undefined ) {
            changes.name = req.body.name;
        }
        if( req.body.description !== undefined ) {
            changes.description = req.body.description;
        }
        if( req.body.price !== undefined ) {
            changes.price = req.body.price;
        }
        if( req.body.category !== undefined ) {
            changes.category = req.body.category;
        }
        if( req.body.stock !== undefined ) {
            changes.stock = req.body.stock;
        }
        if( req.body.published !== undefined ) {
            changes.published = req.body.published;
        }
        if( req.user.role !== "admin"){
            return res.status(400).json({
                message : "You are not authorised"
            });
        }
        const product = await products.findByIdAndUpdate(
            req.params.id,
            changes,
            {
                new : true,
                runValidators : true
            }
        );
        return res.status(201).json( product );
    } catch(err) {
        return res.status(400).json({
            message : "DB Error",
            error : err.message
        });         
    }
}

export const deleteProductById = async( req, res ) => {
    try {
        if( !mongoose.isValidObjectId(req.params.id) ){
            return res.status(400).json({
                message : "Invalid Object Id"
            });
        }
        if( req.user.role !== "admin"){
            return res.status(400).json({
                message : "You are not authorised"
            });
        }
        const product = await products.findByIdAndDelete( req.params.id );
        if( !product ) {
            return res.status(400).json({
                message : "No product found to delete"
            })
        }
        return res.status(200).json({
            product : product,
            message : "Prodct deleted successfully"
        });
    } catch ( err ) {
        return res.status(400).json({
            message : "DB Error",
            error : err.message
        });
    }
}

export const getAllUsers = async ( req, res ) => {
    try {
        if( req.user.role !== "admin" ) {
            return res.status(403).json({
            message : "You are not authorized",
        });
        }
        const users = await User.find({ role : "user" })
            .select("-password")
            .lean();
        return res.status(200).json(users);
    } catch (err) {
        return res.status(400).json({
            message : "DB Error",
            error : err.message
        });       
    }
}

export const deleteUserById = async( req, res ) => {
    try {
        if( !mongoose.isValidObjectId(req.params.id) ){
            return res.status(400).json({
                message : "Invalid Object Id"
            });
        }
        if( req.user.role !== "admin"){
            return res.status(400).json({
                message : "You are not authorised"
            });
        }
        const user = await User.findByIdAndDelete( req.params.id );
        if( !user ) {
            return res.status(400).json({
                message : "No user found to delete"
            })
        }
        return res.status(200).json({
            user : user,
            message : "User deleted successfully"
        });
    } catch ( err ) {
        return res.status(400).json({
            message : "DB Error",
            error : err.message
        });
    }
}

export const importProductsCSV = [
    upload.single('file'),

    async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({message: 'CSV file is required'});
            }
            const rows = [];
            Readable
                .from(req.file.buffer.toString())
                .pipe(csv())
                .on('data', row => rows.push(row))
                .on('end', async () => {

                    if (!rows.length) {
                        return res.status(400).json({message: 'CSV file is empty'});
                    }
                    
                    const productsData = [];
                    const errors = [];

                    rows.forEach((row, index) => {
                        const rowErrors = [];
                        if (!row.name?.trim()) {
                            rowErrors.push('name is required');
                        }
                        if (!row.description?.trim()) {
                            rowErrors.push('description is required');
                        }
                        const price = Number(row.price);
                        if (!price || price <= 0) {
                            rowErrors.push('invalid price');
                        }
                        if (!row.category?.trim()) {
                            rowErrors.push('category is required');
                        }
                        const stock = Number(row.stock);
                        if (isNaN(stock) || stock < 0) {
                            rowErrors.push('invalid stock');
                        }
                        if (!['true', 'false'].includes(row.published?.toLowerCase())) {
                            rowErrors.push('published must be true or false');
                        }

                        if (rowErrors.length)
                        {
                            errors.push({row: index + 2,errors: rowErrors});
                        } else {
                            productsData.push({
                                name: row.name.trim(),
                                description: row.description.trim(),
                                price,
                                category: row.category.trim(),
                                stock,
                                published: row.published.toLowerCase() === 'true'
                            });
                        }
                    });

                    if (errors.length) {
                        return res.status(400).json({message: 'CSV validation failed',errors});
                    }
                    const result = await products.insertMany(productsData);
                    return res.status(201).json({message: 'Products imported successfully',count: result.length});
                });

        } catch (err) {
            return res.status(500).json({message: 'Import failed',error: err.message});
        }
    }
];