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

//add user
router.post('/',async (req, res) => {
    const { firstName, lastName, email,image,phone,apartmentNumber,floorNumber,BuildingNumber,street,area,city} = req.body;
    let address = {apartmentNumber,floorNumber,BuildingNumber,street,area,city}
    if (!(firstName && lastName && email && req.body.password)) {

        res.status(500).json('you must enter all required field')
    } else {

        try {
            const oldUser = await UserModel.findOne({ email });

            if (oldUser) {

                res.status(400).json('this email is already exist');

            }
            else {

                const hashedPassword = crypto.AES.encrypt(req.body.password, process.env.PASS_SECRET_KEY).toString();
                const user = new UserModel({ firstName, lastName, email, password: hashedPassword,address,phone,image });
                const savedUser = await user.save();
                const { password, ...other } = savedUser._doc;
                res.status(200).json(other);
            }

        } catch (err) {
            res.status(400).json(err);
        }


    }
})

export default router