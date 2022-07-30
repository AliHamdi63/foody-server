import mongoose from 'mongoose';

const mealSchema = mongoose.Schema({
    name:{type:String,required:true},
    addons:{type:String},
    cookingDuration:{type:Number,required:true},
    price:{type:Number,required:true},
    servings:{type:Number,default:1},
    description:{type:String,required:true},
    calories:{type:Number},
    image:{type:String,required:true},
    cuisine:{type:String,default:'other'},
    category:{type:String,default:'other'},
    ingredients:{
        image:{type:String},
        _ingredients:[{
            quantity:{type:String},
            name:{type:String}
        }]
    },
    instructions:[{
        image:{type:String,require:true},
        title:{type:String,require:true},
        description:{type:String,require:true},
    }],

},{timestamps:true})

const MealModel = mongoose.model('Meal',mealSchema);

export default MealModel;