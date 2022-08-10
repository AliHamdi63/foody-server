import express from "express";
import { verifyTokenAndAuthorizationAsAdmin, verifyToken } from "../middleware/verifyToken.js"
import { checkout, deleteOrder, getAllIncome, getAllOrders, getDeffIncomeMonthly, getDeffOrderMonthly, getMonthlyIncome, getMonthlyIncomeForUser, getNumberOfOrders, getOrder, getTodayIncome, getUserOrdersForDashboard, getUserOrdersForWebSite, makeOrder, updateOrder } from "../controlers/order.js";

const router = express.Router()

//make order
router.post("/", verifyToken,makeOrder)

//get all orders
router.get("/", verifyTokenAndAuthorizationAsAdmin,getAllOrders)

//get user orders for website
router.get("/userOrders", verifyToken,getUserOrdersForWebSite)

//get user orders for dashboard
router.get("/userOrders/:userId", verifyTokenAndAuthorizationAsAdmin, getUserOrdersForDashboard)

//get number of orders
router.get('/numberOfOrders',verifyTokenAndAuthorizationAsAdmin,getNumberOfOrders)

//get one order
router.get("/:orderid", verifyTokenAndAuthorizationAsAdmin, getOrder)

//update order
router.put("/:orderid", verifyTokenAndAuthorizationAsAdmin, updateOrder)

//delete order
router.delete("/:orderid", verifyTokenAndAuthorizationAsAdmin, deleteOrder)

// GET MONTHLY INCOME
router.get("/monthly/income",verifyTokenAndAuthorizationAsAdmin, getMonthlyIncome);

// GET MONTHLY INCOME for user orders
router.get("/monthly/spending/:userId",verifyTokenAndAuthorizationAsAdmin, getMonthlyIncomeForUser);

//get today income
router.get("/today/income",verifyTokenAndAuthorizationAsAdmin, getTodayIncome);

//all income
router.get("/all/income",verifyTokenAndAuthorizationAsAdmin, getAllIncome);

// deff income monthly
router.get('/deffrenceincome/monthly',getDeffIncomeMonthly)

//deff order monthly
router.get('/deffrence/monthly',getDeffOrderMonthly)

//checkout
router.post(`/checkout`, checkout);


export default router