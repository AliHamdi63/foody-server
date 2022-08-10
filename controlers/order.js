import mongoose from "mongoose";
import OrderModel from '../models/order.js';
import MealModel from '../models/meal.js';
import Stripe from 'stripe';

const stripe = Stripe('sk_test_51LUWrXDC6Iq6SC4A9g3W8qH33SUu9pVR4SlF7YxmgmiuSsQWIaBFUEeXNmdNnVOgJpMRIdCKIvSXmjSq9WuZOXsl00AHxDmBCz');

export const makeOrder =  async (req, res) => {
    const user = req.user.id
    const { meals, methodOfPayment } = req.body
    try {
        const storeMeals = await MealModel.aggregate([
          {$project:{_id:1,price:1}},
        ]);
        let amount = meals.reduce((prev,cur)=>{
          const currentMeal = storeMeals.find(storeMeal=>{
            return storeMeal._id.toString()===cur.meal
          });
          const currentPrice = currentMeal.price * cur.quantity;
          return prev + currentPrice;
        },0)

        const neworder = new OrderModel({ user, meals, amount, methodOfPayment })
        const savedOrder =  await neworder.save()
        res.status(200).json(savedOrder)
    } catch (error) {
        res.status(400).json(error)

    }
}

export const getAllOrders = async (req, res) => {
    let limit = req.query.limit;
    try {

        const allorder = await OrderModel.find().limit(limit).populate(["user", "meals.meal"])

        res.status(200).json(allorder)
    } catch (error) {
        res.status(400).json(error.message)

    }
}

export const getUserOrdersForWebSite = async (req, res) => {
    const _id = req.user.id
    try {

        const allorder = await OrderModel.find({ user: _id }).populate(["user", "meals.meal"])

        res.status(200).json(allorder)
    } catch (error) {
        res.status(400).json(error.message)

    }
}

export const getUserOrdersForDashboard = async (req, res) => {
    const id = req.params.userId
    try {
  
        const allorder = await OrderModel.find({ user: id }).populate(["user", "meals.meal"])
  
        res.status(200).json(allorder)
    } catch (error) {
        res.status(400).json(error.message)
  
    }
  }

  export const getNumberOfOrders = async(req,res)=>{

    try{
        const count = await OrderModel.count();
        res.status(200).json(count);
  
    }catch(err){
        res.status(400).json(err);
    }
  }

  export const getOrder = async (req, res) => {
    const _id = req.params.orderid
    try {

        const allorder = await OrderModel.findOne({ _id }).populate(["user", "meals.meal"])
        res.status(200).json(allorder)
    } catch (error) {
        res.status(400).json(error.message)

    }
}

export const updateOrder = async (req, res) => {
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
}

export const deleteOrder = async (req, res) => {
    const _id = req.params.orderid
    try {

        const toDeletOorder = await OrderModel.findOneAndDelete({ _id })

        res.status(200).json(toDeletOorder)
    } catch (error) {
        res.status(400).json(error.message)

    }
}

export const getMonthlyIncome = async (req, res) => {
    const date = new Date();
    const lastSixMonths = new Date(date.setMonth(date.getMonth() - 6));

 
    try {
      const income = await OrderModel.aggregate([
        { $match: { createdAt: { $gte: lastSixMonths } } },
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
  }

  export const getMonthlyIncomeForUser = async (req, res) => {
    const date = new Date();
    const lastsixMonths = new Date(date.setMonth(date.getMonth() - 6));
  
    try {
      const income = await OrderModel.aggregate([
  
        { $match: { $and:[{createdAt: { $gte: lastsixMonths }},{user:new mongoose.mongo.ObjectId(req.params.userId)}] } },
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
  }

  export const getTodayIncome = async (req, res) => {
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
  }

  export const getAllIncome = async (req, res) => {
 
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
  }

  export const getDeffIncomeMonthly = async(req,res)=>{
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
}

export const getDeffOrderMonthly = async(req,res)=>{
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
}

export const checkout = async (req, res) => {

    try {

      const storeMeals = await MealModel.aggregate([
        {$project:{_id:1,name:1,price:1}},
      ])

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: req.body.meals.map((item) => {
          const storeMeal = storeMeals.find((meal)=>{return meal._id.toString()===item.meal});
          console.log(storeMeal);
          return {
            price_data: {
              currency: "egp",
              product_data: {
                name: storeMeal['name'],
              },
              unit_amount: Math.round(storeMeal['price']*100),
            },
            quantity: item.quantity,
          };
        }),
        success_url: `PurchaseSuccess`,
        cancel_url: `Cart`,
      });
      res.json({ url: session.url });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }