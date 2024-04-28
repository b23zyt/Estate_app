import express from "express";
import { deleteUser, getUser, getUsers, updateUser } from "../controllers/user.controller.js";
import {verifyToken} from "../middleware/verifyToken.js";

const userRouter = express.Router();

userRouter.get("/", getUsers); //get all users
userRouter.get("/:id",verifyToken, getUser); //get single user
userRouter.put("/:id", verifyToken, updateUser); //change profile
userRouter.delete("/:id", verifyToken, deleteUser);

export default userRouter;