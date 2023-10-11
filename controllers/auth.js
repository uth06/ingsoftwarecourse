import User from "../models/User.js";
import bcrypt from "bcryptjs"
import { createError } from "../utils/error.js";
import Jwt  from "jsonwebtoken";

export const register = async (req, res, next) => {
    try{
        const salt = bcrypt.genSaltSync(10);
        const pass = bcrypt.hashSync(req.body.password, salt);
        const newUser = new User({
            username:req.body.username,
            email:req.body.email,
            password:pass
        });
        const user = await newUser.save();
        res.status(201).json(user);
    }catch(err){
        next(err)
    }
} 

export const login = async (req, res, next) => {
    try{
        const user = await User.findOne({username:req.body.username});
        if(!user) return next(createError(404,"!Usuario no encontrado"));
        const isPasswordCorrect = await bcrypt.compare(req.body.password,user.password);
        if(!isPasswordCorrect) return next(createError(400,"Datos de acceso incorrectos"));
        
        const token = Jwt.sign({id:user._id,isAdmin:user.isAdmin},process.env.Jwt)
        
        const {password,isAdmin,...other} = user._doc
        
        res
        .cookie("access_token",token,{
            httpOnly:true,
        })
        .status(200).json({...other});
    }catch(err){
        next(err)
    }
} 