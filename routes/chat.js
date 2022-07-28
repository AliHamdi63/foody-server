const express = require('express')
const ChatModel = require('../models/chat');
const router = express.Router();


// create new chat
router.post('/',async(req,res)=>{

    const chat = new ChatModel({
        members: [req.body.senderId,req.body.recieverId]
    })
    
    try{
        
        const newChat = await chat.save();
        
        console.log('aaaaaaa');
        res.status(200).json(newChat);

    }catch(err){
        res.status(500).json(err);
    }

})

// get user chats

router.get('/:userId',async(req,res)=>{
    
    try {

        const chats = await ChatModel.find({members:{$in:[req.params.userId]}});

        res.status(200).json(chats);
        
    } catch (err) {
        res.status(500).json(err);
    }
})

//find chat 

router.get('/:senderId/:recieverId',async(req,res)=>{
    try {

        const chat = await ChatModel.findOne({
            members:{$all:[req.params.senderId,req.params.recieverId]
            }});

        res.status(200).json(chat);
        
    } catch (err) {
        res.status(500).json(err);
    }
})

module.exports =  router;



