import express from 'express';
import { register,login } from '../controlers/auth.js';

const router = express.Router();

//register endPoint => /auth/regiser
router.post('/register',register)

//login endPoint => /auth/login
router.post('/login',login)


export default router;

