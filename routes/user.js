import express from "express";
import UserModel from '../models/user.js';

import { verifyTokenAndAuthorizationAsAdmin, verifyTokenAndAuthorization } from "../middleware/verifyToken.js"

let router = express.Router()

// get all admins
router.get("/admin",verifyTokenAndAuthorizationAsAdmin, async (req, res) => {
    console.log("--------------------------------------------------");
    try{
        const alladmins = await UserModel.find({ isAdmin: true })
        res.status(200).json(alladmins)

    }catch(err){
        res.status(400).json(err)
    }
})

//get all users
router.get("/", verifyTokenAndAuthorizationAsAdmin, async (req, res) => {
    try{
        const allusers = await UserModel.find({})
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

    try {
        let updateeduser = await UserModel.findOne({ _id: req.params.id })

        let keys = Object.keys(req.body)
        keys.forEach((key => {
            updateeduser[key] = req.body[key]
        }))
        await updateeduser.save()

        res.status(200).json(updateeduser)
        
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

export default router