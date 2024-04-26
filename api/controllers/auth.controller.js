import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

import env from "dotenv";
// import connectDB from "./config/database.js";
// import User from "./models/user.js";

export const register = async(req, res) =>{
    const {username, email, password} = req.body;
    try {
        //HASH PASSWORD
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);

        //SAVE DATA TO DATABASE
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });
        console.log(newUser);
        res.status(201).json({message: "User Created Successfully"});
    }catch(err) {
        console.log(err);
        res.status(500).json({message: "Failed to create user!"});
    }
};


export const login = async(req, res) => {
    const {username, password} = req.body;
    try {
        //CHECK IF THE USER EXISTS
        const user = await prisma.user.findUnique({
            where:{username}
        });

        if(!user) return res.status(401).json({message: "Invalid Credentials"});
        
        //CHECK IF THE PASSWORD IS CORRECT
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if(!isPasswordValid) return res.status(401).json({message: "Invalid Credentials"});
        
        //GENERATE COOKIE TOKEN AND SEND TO THE USER WITHOUT USING COOKIE PARSER
        // res.setHeader("Set-Cookie", "test=" + "myValue").json({message: "success"}); (test is the cookie name),

        const age = 1000 * 60 * 60 * 24 * 7;

        //json web token: a standardized way to securely send data between two parties.
        //use secret key to hash the id GENERATE SECRET KEY: openssl rand -base64 32
        const token = jwt.sign(
            {
            id: user.id,
            isAdmin: true,
            }, 
            process.env.JWT_SECRET_KEY,
            {expiresIn: age}
        );

        const {password: userPassword, ...userInfo} = user;
        //INCLUDE cookie-parser inside app.js
        //httpOnly: client site javascript cannot access the cookie
        //when a user make a request, we can decrypt the token and know the user's id
        res.cookie("token", token, {
            httpOnly: true,
            // secure: true,
            maxAge: age,
        }).status(200).json(userInfo);

    }catch(err){
        console.log(err);
        res.status(500).json({message: "Failed to login!"});
    }
};



//DELETE COOKIE WHEN USER MAKE THE REQUEST
export const logout = (req, res) =>{
    res.clearCookie("token").json({message: "logout successful"})
};