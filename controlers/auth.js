import UserModel from '../models/user.js';
import crypto from 'crypto-js';
import jwt from 'jsonwebtoken';


export const register = async (req, res) => {
    const { firstName, lastName, email, Password } = req.body;

    if (!(firstName && lastName && email && Password)) {

        res.status(500).json('you must enter all required field')
    } else {

        try {
            const oldUser = await UserModel.findOne({ email });

            if (oldUser) {

                res.status(400).json('this email is already exist');

            }
            else {

                const hashedPassword = crypto.AES.encrypt(Password, process.env.PASS_SECRET_KEY).toString();
                const user = new UserModel({ firstName, lastName, email, password: hashedPassword });
                const savedUser = await user.save();
                const { password, ...other } = savedUser._doc;
                console.log(other, "other");
                res.status(200).json(other);
            }

        } catch (err) {
            console.log(err, "error");
            res.status(400).json(err);
        }


    }
}

export const login = async (req, res) => {
    const { email, Password } = req.body;

    if (!(email && Password)) {
        res.status(400).json('you must enter all required field')
    } else {
        try {
            const user = await UserModel.findOne({ email });

            if (user) {

                const decryptPass = crypto.AES.decrypt(user.password, process.env.PASS_SECRET_KEY).toString(crypto.enc.Utf8)

                if (decryptPass == Password) {

                    const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.TOKEN_KEY, { expiresIn: '2d' });

                    const { password, ...other } = user._doc;
                    res.status(200).json({ ...other, token })

                } else {
                    res.status(400).json('password is wrong')
                }

            } else {
                res.status(500).json('email does not exist');
            }

        } catch (err) {
            res.status(500).json(err);
        }
    }
}