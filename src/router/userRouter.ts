import express from "express"
import { UserBusiness } from '../business/userBusiness';
import { UserData } from "../data/userData";
import { UserController } from "../controller/userController";

const userBusiness: UserBusiness = new UserBusiness( new UserData() );
const userController: UserController = new UserController( userBusiness );

export const userRouter = express.Router();

userRouter.post( "/signup", userController.signup )
userRouter.get( "/user", userController.getUserByID )
userRouter.post( "/login", userController.login )