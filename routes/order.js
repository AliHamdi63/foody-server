import express from "express";
import OrderModel from '../models/order.js';
import { verifyTokenAndAuthorizationAsAdmin, verifyToken } from "../middleware/verifyToken.js"


const router = express.Router()

//make order
router.post("/", verifyToken, async (req, res) => {
    const user = req.user.id
    const { meals, amount, methodOfPayment } = req.body
    try {

        const neworder = new OrderModel({ user, meals, amount, methodOfPayment })
        const savedOrder =  await neworder.save()
        res.status(200).json(savedOrder)
    } catch (error) {
        res.status(400).json(error)

    }
})

//get all orders
router.get("/", verifyTokenAndAuthorizationAsAdmin, async (req, res) => {

    try {

        const allorder = await OrderModel.find().populate(["user", "meals.meal"])

        res.status(200).json(allorder)
    } catch (error) {
        res.status(400).json(error.message)

    }
})


//get user orders for website
router.get("/userOrders", verifyToken, async (req, res) => {
    const _id = req.user.id
    try {

        const allorder = await OrderModel.find({ user: _id }).populate(["user", "meals.meal"])

        res.status(200).json(allorder)
    } catch (error) {
        res.status(400).json(error.message)

    }
})

//get user orders for dashboard
router.get("/userOrders/:userId", verifyTokenAndAuthorizationAsAdmin, async (req, res) => {
  const id = req.params.userId
  try {

      const allorder = await OrderModel.find({ user: id }).populate(["user", "meals.meal"])

      res.status(200).json(allorder)
  } catch (error) {
      res.status(400).json(error.message)

  }
})

//get number of orders
router.get('/numberOfOrders',verifyTokenAndAuthorizationAsAdmin,async(req,res)=>{

  try{
      const count = await OrderModel.count();
      res.status(200).json(count);

  }catch(err){
      res.status(400).json(err);
  }
})



router.get("/:orderid", verifyTokenAndAuthorizationAsAdmin, async (req, res) => {
    const _id = req.params.orderid
    try {

        const allorder = await OrderModel.findOne({ _id }).populate(["user", "meals.meal"])
        res.status(200).json(allorder)
    } catch (error) {
        res.status(400).json(error.message)

    }
})

router.put("/:orderid", verifyTokenAndAuthorizationAsAdmin, async (req, res) => {
    const _id = req.params.orderid
    const status = req.body.status;
    try {

        const toupdateorder = await OrderModel.findOne({ _id }).populate(["user", "meals.meal"])
        toupdateorder.status = status
        await toupdateorder.save()
        res.status(200).json(toupdateorder)
    } catch (error) {
        res.status(400).json(error.message)

    }
})
router.delete("/:orderid", verifyTokenAndAuthorizationAsAdmin, async (req, res) => {
    const _id = req.params.orderid
    try {

        const toDeletOorder = await OrderModel.findOneAndDelete({ _id })

        res.status(200).json(toDeletOorder)
    } catch (error) {
        res.status(400).json(error.message)

    }
})

// GET MONTHLY INCOME

router.get("/monthly/income",verifyTokenAndAuthorizationAsAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

 
    try {
      const income = await OrderModel.aggregate([
        { $match: { createdAt: { $gte: lastYear } } },
        {
          $project: {
            month: { $month: "$createdAt" },
            sales: "$amount",
          },
        },
        {
          $group: {
            _id: "$month",
            total: { $sum: "$sales" },
          },
        },
      ]).sort({_id:1});
      res.status(200).json(income);
    } catch (err) {
      res.status(500).json(err);
    }
  });

// GET MONTHLY INCOME for user orders

router.get("/monthly/spending",verifyTokenAndAuthorizationAsAdmin, async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const income = await OrderModel.aggregate([

      { $match: { $and:[{createdAt: { $gte: lastYear }},{user:req.user.id}] } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]).sort({_id:1});
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
});

  router.get("/today/income",verifyTokenAndAuthorizationAsAdmin, async (req, res) => {
    const date = new Date();
    const yesterday = new Date(date.setDate(date.getDate() - 1));
 
    try {
      const income = await OrderModel.aggregate([
        { $match: { createdAt: { $gt: yesterday } } },
        {
          $group: {
            _id: "null",
            total: { $sum: "$amount" },
          },
        },
      ]);
      res.status(200).json(income);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  //all income
  router.get("/all/income",verifyTokenAndAuthorizationAsAdmin, async (req, res) => {
 
    try {
      const income = await OrderModel.aggregate([
        {
          $group: {
            _id: "null",
            total: { $sum: "$amount" },
          },
        },
      ]);
      res.status(200).json(income[0]['total']);
    } catch (err) {
      res.status(500).json(err);
    }
  });

  router.get('/deffrenceincome/monthly',async(req,res)=>{
    const day = new Date();
    const lastTwoMonth = new Date(day.setMonth(day.getMonth()-2));
    try {
        
        let diff = await OrderModel.aggregate([
          { $match: { createdAt: { $gte: lastTwoMonth } } },
          {
            $project: {
              month: { $month: "$createdAt" },
              sales: "$amount",
            },
          },
          {
            $group: {
              _id: "$month",
              total: { $sum: "$sales" },
            },
          },
        ]).sort({_id:1})
        diff = Math.round((diff[1].total - diff[0].total)/(diff[0].total + diff[1].total)*100)
        res.status(200).json(diff);
    } catch (err) {
        res.status(400).json(err)
    }
})

  router.get('/deffrence/monthly',async(req,res)=>{
    const day = new Date();
    const lastTwoMonth = new Date(day.setMonth(day.getMonth()-2));
    try {
        
        let diff = await OrderModel.aggregate([
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