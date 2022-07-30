import express, { Router } from "express";
import UserModel from '../models/user.js';

import { verifyTokenAndAuthorizationAsAdmin, verifyTokenAndAuthorization } from "../middleware/verifyToken.js"

let router = express.Router()

router.get("/admin", async (req, res) => {
    console.log("--------------------------------------------------");
    const alladmins = await UserModel.find({ isAdmin: true })
    res.send(alladmins)
})
router.get("/", verifyTokenAndAuthorizationAsAdmin, async (req, res) => {
    const allusers = await UserModel.find({})
    res.send(allusers)
})
router.get("/:id", verifyTokenAndAuthorization, async (req, res) => {

    const user = await UserModel.findById({ _id: req.params.id })
    res.send(user)
})

router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    let updateeduser = await UserModel.findOne({ _id: req.params.id })
    console.log(req.body, "body", updateeduser);
    let keys = Object.keys(req.body)
    keys.forEach((key => {
        updateeduser[key] = req.body[key]
    }))
    await updateeduser.save()
    console.log(keys, "------", updateeduser);
    res.send(updateeduser)
})
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    const deleteduser = await UserModel.findByIdAndDelete(req.params.id)
    if (deleteduser) {
        res.status(200).send(deleteduser.email + " deleted successfully")

    }
    res.status(500).send("error deleting user")

})

export default router