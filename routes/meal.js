import {verifyTokenAndAuthorizationAsAdmin} from '../middleware/verifyToken.js';
import express from 'express';
import {addNewMeal,deleteMeal,editIngredients,editInstructions,editMeal,getCategories,getCuisine,getMeals,getName,getOneMeal, searchByName} from '../controlers/meal.js'


const router = express.Router();

//add new meal
router.post('/',verifyTokenAndAuthorizationAsAdmin,addNewMeal)

//edit main meal
router.put('/:id',verifyTokenAndAuthorizationAsAdmin,editMeal)

//edit ingredients in a meal
router.put('/:id/ingredients',verifyTokenAndAuthorizationAsAdmin,editIngredients)

//edit instructions in a meal
router.put('/:id/instructions',verifyTokenAndAuthorizationAsAdmin,editInstructions)


//delete meal
router.delete('/:id',verifyTokenAndAuthorizationAsAdmin,deleteMeal)

//get one meal
router.get('/:id',getOneMeal)

//get all meals by page and limit and you can filter them if by cuisine and category
router.get('/',getMeals)

// get categories
router.get('/find/categories',getCategories)

//get cuisine
router.get('/find/cuisine',getCuisine)

//get names
router.get('/find/name',getName)

//search for meal by name
router.get('/search/:name',searchByName)


export default router;