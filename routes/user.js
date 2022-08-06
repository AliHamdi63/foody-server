import express from "express";
import UserModel from '../models/user.js';
import crypto from 'crypto-js';
import { verifyTokenAndAuthorizationAsAdmin, verifyTokenAndAuthorization } from "../middleware/verifyToken.js"

let router = express.Router()

// get all admins
router.get("/admin",verifyTokenAndAuthorizationAsAdmin, async (req, res) => {

    try{
        let alladmins = await UserModel.find({ isAdmin: true })
        alladmins = alladmins.filter((admin)=>admin._id!==req.user.id);
        res.status(200).json(alladmins)

    }catch(err){
        res.status(400).json(err)
    }
})

//get number of users
router.get('/numberOfUsers',verifyTokenAndAuthorizationAsAdmin,async(req,res)=>{

    try{
        const count = await UserModel.count();
        res.status(200).json(count);

    }catch(err){
        res.status(400).json(err);
    }
})

//get all users
router.get("/", verifyTokenAndAuthorizationAsAdmin, async (req, res) => {
    try{
        const allusers = await UserModel.find({isAdmin:false})
        res.status(200).json(allusers)

    }catch(err){
        res.status(400).json(err)
    }
})

//get user by ID
router.get("/:id", verifyTokenAndAuthorization, async (req, res) => {

    try {
        const user = await UserModel.findById(req.params.id)
        res.status(200).json(user)
        
    } catch (err) {
        res.status(400).json(err)
    }
})

//edit user
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {

    if(req.body.password){
        req.body.password = crypto.AES.encrypt(req.body.password, process.env.PASS_SECRET_KEY).toString();
    }

    try {
        
        const updatedUser = await UserModel.findByIdAndUpdate(req.params.id,req.body,{new:true})

        res.status(200).json(updatedUser)
        
    } catch (err) {
        res.status(400).json(err)
    }
})

//delete user
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {

        try {
            const deleteduser = await UserModel.findByIdAndDelete(req.params.id)
            res.status(200).json(deleteduser)
            
        } catch (err) {
            res.status(400).json(err)
        }


})

router.get('/deffrence/monthly',async(req,res)=>{
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
})

export default router