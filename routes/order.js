import express from "express";
import OrderModel from '../models/order.js';
import { verifyTokenAndAuthorizationAsAdmin, verifyTokenAndAuthorization } from "../middleware/verifyToken.js"


const router = express.Router()

router.post("/", verifyTokenAndAuthorization, async (req, res) => {
    const user = req.user.id
    const { meals, amount, status, methodOfPayment } = req.body
    try {

        const neworder = new OrderModel({ user, meals, amount, status, methodOfPayment })
        await neworder.save()
        res.status(200).json(neworder)
    } catch (error) {
        res.status(400).json(error)

    }
})
router.get("/", verifyTokenAndAuthorization, async (req, res) => {
    const _id = req.user.id
    try {

        const allorder = await OrderModel.find({ user: _id }).populate(["user", "meals.meal"])
        console.log(allorder);
        res.status(200).json(allorder)
    } catch (error) {
        res.status(400).json(error.message)

    }
})
router.get("/:orderid", verifyTokenAndAuthorizationAsAdmin, async (req, res) => {
    const _id = req.params.orderid
    try {

        const allorder = await OrderModel.find({ _id }).populate(["user", "meals.meal"])
        console.log(allorder);
        res.status(200).json(allorder)
    } catch (error) {
        res.status(400).json(error.message)

    }
})

router.put("/:orderid/:status", verifyTokenAndAuthorizationAsAdmin, async (req, res) => {
    const _id = req.params.orderid
    const status = req.params.status
    try {

        const toupdateorder = await OrderModel.findOne({ _id }).populate(["user", "meals.meal"])
        toupdateorder.status = status
        await toupdateorder.save()
        console.log(toupdateorder);
        res.status(200).json(toupdateorder)
    } catch (error) {
        res.status(400).json(error.message)

    }
})
router.delete("/:orderid", verifyTokenAndAuthorizationAsAdmin, async (req, res) => {
    const _id = req.params.orderid
    try {

        const toDeletOorder = await OrderModel.findOneAndDelete({ _id })

        console.log(toupdateorder);
        res.status(200).json(toDeletOorder)
    } catch (error) {
        res.status(400).json(error.message)

    }
})


export default router