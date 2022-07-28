const express = require('express')
const MessageModel = require('../models/message');

const router = express.Router();

//create message
router.post('/',async(req,res)=>{
    
    const message = new MessageModel({
        chatId: req.body.chatId,
        senderId:req.body.senderId,
        text:req.body.text
    })
    
    try{
        const savedMessage = await message.save();

        res.status(200).json(savedMessage);

    }catch(err){
        res.status(500).json(err)
    }
})

//get messages of specific chat

router.get('/:chatId',async(req,res)=>{
    try {
        const messages = await MessageModel.find({
            chatId: req.params.chatId
        })
        res.status(200).json(messages);
        
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports =  router;



