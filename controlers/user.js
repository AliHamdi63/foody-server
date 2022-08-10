import UserModel from '../models/user.js';
import crypto from 'crypto-js';
import jwt from "jsonwebtoken";

export const getAdmins = async (req, res) => {

    try{
        let alladmins = await UserModel.find({ isAdmin: true })
        const admins = alladmins.filter((admin)=>{

           return admin._id.toString()!== req.user.id
        });

        res.status(200).json(admins)

    }catch(err){
        res.status(400).json(err)
    }
}

export const getNumberOfUsers = async(req,res)=>{

    try{
        const count = await UserModel.count();
        res.status(200).json(count);

    }catch(err){
        res.status(400).json(err);
    }
}

export const getAllUsers = async (req, res) => {
    try{
        const allusers = await UserModel.find({isAdmin:false}).sort({_id:-1})
        res.status(200).json(allusers)

    }catch(err){
        res.status(400).json(err)
    }
}

export const getUser = async (req, res) => {

    try {
        const user = await UserModel.findById(req.params.id)
        res.status(200).json(user)
        
    } catch (err) {
        res.status(400).json(err)
    }
}

export const editUser = async (req, res) => {

    if(req.body.password){
        req.body.password = crypto.AES.encrypt(req.body.password, process.env.PASS_SECRET_KEY).toString();
    }

    try {
        
        const updatedUser = await UserModel.findByIdAndUpdate(req.params.id,req.body,{new:true})
        let token;
        if(!req.user.isAdmin){

             token = jwt.sign({ id: req.params.id, isAdmin: false }, process.env.TOKEN_KEY, { expiresIn: '2d' });
            
        }
        if(token){
            res.status(200).json({...updatedUser,token})
        }else{
            res.status(200).json(updatedUser)
        }
        
    } catch (err) {
        res.status(400).json(err)
    }
}

export const deleteUser = async (req, res) => {

    try {
        const deleteduser = await UserModel.findByIdAndDelete(req.params.id)
        res.status(200).json(deleteduser)
        
    } catch (err) {
        res.status(400).json(err)
    }


}

export const diffMonthly = async(req,res)=>{
    const day = new Date();
    const lastTwoMonth = new Date(day.setMonth(day.getMonth()-2));
    try {
        
        let diff = await UserModel.aggregate([
            { $match: { createdAt: { $gte: lastTwoMonth } } },
            {
                $project: {
                  month: { $month: "$createdAt" },
                },
              },
              {
                $group: {
                  _id: "$month",
                  total: { $sum: 1 },
                },
              },
        ]).sort({_id:1})
        diff = Math.round((diff[1].total - diff[0].total)/(diff[0].total + diff[1].total)*100)
        res.status(200).json(diff);
    } catch (err) {
        res.status(400).json(err)
    }
}