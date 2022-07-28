import multer from "multer";
import express from 'express';

const router = express.Router();

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,'./public/images')
    },
    filename: (req,file,cb)=>{
        cb(null,req.body.name)
    }
})

const upload = multer({storage:storage});

router.post('/images',upload.single('file'),(req,res)=>{
    res.status(200).json('uploaded image successfully');
})

export default router;


