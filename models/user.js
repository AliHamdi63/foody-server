import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    firstName:{type:String,required:true},
    lastName:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    address:{
                apartmentNumber:{type:String},
                floorNumber:{type:String},
                BuildingNumber:{type:String},
                street:{type:String},
                area:{type:String},
                city:{type:String},
                location:{
                    lat:{type:Number},
                    lon:{type:Number},
                }
            },
    phone:{type:String},
    image:{type:String,default:'person.jpg'},
    isAdmin:{type:Boolean,default:false}
},{timestamps:true})

const UserModel = mongoose.model('User',userSchema);

export default UserModel;