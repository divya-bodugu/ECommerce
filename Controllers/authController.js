import jsonwebtoken from "jsonwebtoken";
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import User from '../Models/userModel.js';
import { generateToken } from "../middleware/authMiddleware.js";

export async function userRegister(req, res){
    try{
        const {name, email,password, role}=req.body;
        if(!name||!email||!password||!role){
            return res.status(400).json({message:"name, email,password and role are required"});
        }
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({message:"user already exist"});
        }
        const hashedPassword= await bcrypt.hash(password, 10);

        const newuser= await User.create({
            name:name,
            email:email,
            password:hashedPassword,
            role:role,
        });
        res.status(201).json({message:"Registered Successfully"});
    }
    catch(err){
        return res.status(500).json({message:"registration failed", error:err.message});
    }
}


export async function login(req,res){
    try{
        const {email, password}=req.body;
        if(!email||!password){
            return res.status(400).json({message:"email and password are required"});
        }
        const user=await User.findOne({email});
        if(!user){
            return res.status(401).json({message:"Invalid Email"});
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if(!passwordMatch){
            return res.status(401).json({message:"Invalid Password"});
        }
        const token=generateToken(user);
        res.status(200).json({message:"Login successful", users:user.name, tokens:token});

    }
    catch(err){
        return res.status(500).json({message:"Login failed", error:err.message});
    }
}