const express = require("express");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const {User} = require("../db");
const {JWT_SECRET} = require("../config");

const userRouter = express.Router();

const signupSchema = zod.object({
    username: zod.string().email(),
    password: zod.string().min(6),
    fullName: zod.string().min(1)
})

userRouter.post("/signup", async (req, res) => {
    const body = req.body;
    const {success} = signupSchema.safeParse(body);
    if(!success){
        return res.status(411).json({
            message: "Incorrect inputs"
        })
    }
    const user = await User.findOne({
        username: body.username
    });

    if(user){
        return res.status(411).json({
            message: "Email already taken"
        })
    }

    const dbUser = await User.create(body);

    const token = jwt.sign({
        userId: dbUser._id
    }, JWT_SECRET);

    res.json({
        message: "User Created Successfully",
        token: token
    })
});


const signinSchema = zod.object({
    username: zod.string().email(),
    password: zod.string()
});

userRouter.post("/signin", async (req, res) => {
    const body = req.body;
    const {success} = signinSchema.safeParse(body);
    if(!success){
        return res.status(411).json({
            message: "Error while logging in"
        });
    }

    const user = await User.findOne({
        username: body.username,
        password: body.password
    });
    if(user){
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET);
    
        res.json({
            token: token
        })
        return;
    }
    
    res.status(411).json({
        message: "User Not Found!!"
    });
});


module.exports = {
    userRouter
};