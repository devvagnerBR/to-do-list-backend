import { UserBusiness } from '../business/userBusiness';
import { Request, Response } from 'express';
import { CustomError } from '../models/customError';

export class UserController {

    constructor(
        private userBusiness: UserBusiness
    ) { }

    signup = async ( req: Request, res: Response ) => {

        try {

            const { username, password } = req.body;
            const result = await this.userBusiness.signup( username, password )
            res.status( 200 ).send( { message: "user created successfully", token: result } )

        } catch ( error: any ) {
            if ( error instanceof CustomError ) res.status( error.statusCode ).send( error.message );
            else res.status( 404 ).send( error.message );
        }
    }


    getUserByID = async ( req: Request, res: Response ) => {

        try {

            const token = req.headers.authorization as string;
            const result = await this.userBusiness.getUserById( token );
            res.status( 200 ).send( result );

        } catch ( error: any ) {
            if ( error instanceof CustomError ) res.status( error.statusCode ).send( error.message );
            else res.status( 404 ).send( error.message );
        }
    }

    login = async ( req: Request, res: Response ) => {

        try {
            const { username, password } = req.body;
            const result: string = await this.userBusiness.login( username, password )
            res.status( 200 ).send( { token: result } );

        } catch ( error: any ) {
            if ( error instanceof CustomError ) res.status( error.statusCode ).send( error.message );
            else res.status( 404 ).send( error.message );
        }

    }


    getThe10UsersWithTheHighestScore = async ( req: Request, res: Response ) => {
        try {
            const result = await this.userBusiness.getThe10UsersWithTheHighestScore();
            res.status( 200 ).send( result );

        } catch ( error: any ) {
            if ( error instanceof CustomError ) res.status( error.statusCode ).send( error.message );
            else res.status( 404 ).send( error.message );
        }
    }
}