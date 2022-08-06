import mongoose from "mongoose";



const chatSchema = mongoose.Schema({
    members : {type:Array}
},{timestamps:true})


export default mongoose.model('Chat',chatSchema);





