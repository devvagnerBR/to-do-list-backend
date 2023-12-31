import express from "express"
import { UserBusiness } from '../business/userBusiness';
import { UserData } from "../data/userData";
import { UserController } from "../controller/userController";
import { IdGenerator } from "../services/IdGenerator";
import { Authenticator } from "../services/authenticator";
import { HashManager } from "../services/hashManager";


const userBusiness: UserBusiness = new UserBusiness(
    new UserData(),
    new IdGenerator(),
    new Authenticator(),
    new HashManager()
);

const userController: UserController = new UserController( userBusiness );

export const userRouter = express.Router();

userRouter.post( "/signup", userController.signup );
userRouter.get( "/user", userController.getUserByID );
userRouter.post( "/login", userController.login );
userRouter.get( "/rank", userController.getThe10UsersWithTheHighestScore );
