import MealModel from '../models/meal.js';

export const addNewMeal = async(req,res)=>{
    const meal = new MealModel(req.body);

    try{
        const savedMeal = await meal.save();

        res.status(200).json(savedMeal);

    }catch(err)
    {
        res.status(400).json(err);
    }
}

export const editMeal = async(req,res)=>{
    try{
       const updatedMeal = await MealModel.findByIdAndUpdate(req.params.id,req.body,{new:true});
       res.status(200).json(updatedMeal);

    }catch(err){
        res.status(400).json(err);
    }
}

export const editIngredients = async(req,res)=>{
    try{
        const ingredients = req.body.ingredients;
       const updatedMeal = await MealModel.findByIdAndUpdate(req.params.id,{ingredients},{new:true});
       res.status(200).json(updatedMeal);

    }catch(err){
        res.status(400).json(err);
    }
}

export const editInstructions = async(req,res)=>{
    try{
        const instructions = req.body.instructions;
       const updatedMeal = await MealModel.findByIdAndUpdate(req.params.id,{instructions},{new:true});
       res.status(200).json(updatedMeal);

    }catch(err){
        res.status(400).json(err);
    }
}

export const deleteMeal = async(req,res)=>{
    try{
        const deletedMeal = await MealModel.findByIdAndDelete(req.params.id);
        res.status(200).json(deletedMeal);
 
     }catch(err){
         res.status(400).json(err);
     }
}

export const getOneMeal = async(req,res)=>{
    try{
        const meal = await MealModel.findById(req.params.id);
        res.status(200).json(meal);
 
     }catch(err){
         res.status(400).json(err);
     }
}

export const getMeals = async(req,res)=>{
    const currentPage = req.query.page;
    const limit = req.query.limit || 15;
    const cuisine = req.query.cuisine;
    const category = req.query.category;
    try{
        let meals;
        let count;
        if(cuisine&&category){
            meals = await MealModel.find({cuisine,category}).sort({_id:-1}).skip((currentPage-1)*limit).limit(limit);
            count = await MealModel.count({cuisine,category});

        }else if(cuisine){
            meals = await MealModel.find({cuisine}).sort({_id:-1}).skip((currentPage-1)*limit).limit(limit);
            count = await MealModel.count({cuisine});

        }else if(category){
            meals = await MealModel.find({category}).sort({_id:-1}).skip((currentPage-1)*limit).limit(limit);
            count = await MealModel.count({category});

        }else{
            meals = await MealModel.find({}).sort({_id:-1}).skip((currentPage-1)*limit).limit(limit);
            count = await MealModel.count();

        }
        const pages = Math.ceil(count/limit);
        const maxMealsPerPage = limit;
        res.status(200).json({meals,count,pages,maxMealsPerPage});
    }catch(err){
        res.status(400).json(err);
    }
}

export const getCategories = async(req,res)=>{
    try {
     let cat = await MealModel.aggregate([
 
         {
             $project:{_id:-1,category:1}
         },
         {
             $group:{_id:"$category"}
         }
     ]);
     cat = cat.map((el)=>el._id)
     res.status(200).json(cat);
     
    } catch (err) {
     res.status(400).json(err);
    }
 }

 export const getCuisine = async(req,res)=>{
    try {
     let cas = await MealModel.aggregate([
 
         {
             $project:{_id:-1,cuisine:1}
         },
         {
             $group:{_id:"$cuisine"}
         }
     ]);
     cas = cas.map((el)=>el._id)
     res.status(200).json(cas);
     
    } catch (err) {
     res.status(400).json(err);
    }
 }