import mongoose from "mongoose";



const messageSchema = mongoose.Schema({
    chatId: {type:String},
    senderId : {type:String},
    text:{type:String}
},{timestamps:true})


 export default mongoose.model('Message',messageSchema);





