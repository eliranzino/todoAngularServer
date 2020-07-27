import { SECRET } from "./secret";
import express from "express";
import jwt from "jsonwebtoken";
import {  checkUserExists, register, login } from '../userQueries';
import { userSchema } from '../schemas/userSchema';

const router = express.Router();

router.post('/register', async (req, res) => {
    const { userName, password } = req.body;
    console.log({ userName, password })
    const { error } = userSchema.validate({ userName, password });
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }
    if (await checkUserExists(userName)) {
        res.status(400).send('User already exists');
        return;
    }
    const userId = await register(userName, password);
    console.log('when register user id-',userId)
    const token = generateToken(userId);

    res.send({ success: true, msg: 'welcome!', token });
});

router.post('/login', async (req, res) => {
    const { userName, password } = req.body;
    console.log(userName, password )

    const { error } = userSchema.validate({ userName, password });
    if (error) {
        res.status(400).send(error.details[0].message);
        return;
    }

    const userNameId = await login(userName, password);
    console.log('when login user id-',userNameId)

    if(!userNameId){
        return res.status(401).send({ success: false, msg: 'User name or password dont match.' });
    }
    const token = generateToken(userNameId);
    console.log({token})
    res.send({ token });
});

function generateToken(userId: number| null) {
    return jwt.sign({ id: userId }, SECRET);
}

export { router as users };