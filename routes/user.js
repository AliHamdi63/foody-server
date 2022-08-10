import express from "express";

import { verifyTokenAndAuthorizationAsAdmin, verifyTokenAndAuthorization } from "../middleware/verifyToken.js"

import { deleteUser, diffMonthly, editUser, getAdmins, getAllUsers, getNumberOfUsers, getUser } from "../controlers/user.js";

let router = express.Router()

// get all admins
router.get("/admin",verifyTokenAndAuthorizationAsAdmin, getAdmins)

//get number of users
router.get('/numberOfUsers',verifyTokenAndAuthorizationAsAdmin,getNumberOfUsers)

//get all users
router.get("/", verifyTokenAndAuthorizationAsAdmin, getAllUsers)

//get user by ID
router.get("/:id", verifyTokenAndAuthorization, getUser)

//edit user
router.put("/:id", verifyTokenAndAuthorization, editUser)

//delete user
router.delete("/:id", verifyTokenAndAuthorization, deleteUser)

//get deff monthly
router.get('/deffrence/monthly',diffMonthly)

export default router