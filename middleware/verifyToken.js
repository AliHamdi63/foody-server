import jwt from 'jsonwebtoken';

export const verifyToken=(req,res,next)=>{
    const token = req.headers.token;

    !token && res.status(401).json('you are not authentication');

    jwt.verify(token,process.env.TOKEN_SECRET_KEY,(err,user)=>{
        err && res.status(500).json(err)
        req.user = user;
        next();
    })
}

export const verifyTokenAndAuthorizationAsAdmin=(req,res,next)=>{
    verifyToken(req,res,()=>{
        !(req.user.isAdmin) && res.status.json('you are not allowed to do that');
        next();
    })
}
