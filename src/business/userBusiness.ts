import { UserData } from './../data/userData';
import { IdGenerator } from '../services/IdGenerator';
import { CustomError } from '../models/customError';

export class UserBusiness {


    constructor(
        private UserData: UserData,

    ) { }

    signup = async ( username: string, password: string ) => {

        try {

            if ( !username || !password ) throw new CustomError( 404, "one or more fields are empty" );
            if ( username.length < 3 ) throw new CustomError( 400, "username field must be greater than 3" );
            if ( password.length < 6 ) throw new CustomError( 400, "Password must contain 6 characters or more" );

            const hasUsername = await this.UserData.getUserByUsername( username );

            if ( hasUsername ) throw new CustomError( 409, "username already in use" );
            if ( username.includes( " " ) ) throw new CustomError( 400, "username cannot contain white space" );

            const id: string = IdGenerator();
            await this.UserData.signup( id, username.toLocaleLowerCase(), password );

            const token: string = id
            return token;

        } catch ( error: any ) {
            throw new CustomError( error.statusCode, error.message )
        }

    }

    getUserById = async ( token: string ) => {

        try {

            if ( !token ) throw new CustomError( 404, "token not informed" );
            if ( typeof token !== "string" ) throw new CustomError( 404, "token needs to be a string" );

            const checkUser = await this.UserData.checkIfUserExists( token );
            if ( !checkUser ) throw new CustomError( 404, "user not found" )

            const result = await this.UserData.getUserByID( token );
            return result;

        } catch ( error: any ) {
            throw new CustomError( error.statusCode, error.message )
        }
    }


    login = async ( username: string, password: string ) => {

        try {

            if ( !username || !password ) throw new CustomError( 400, 'one or more fields are empty' );

            const user = await this.UserData.getUserByUsername( username );

            if ( !user ) throw new CustomError( 403, 'user not found' );
            if ( user.password !== password ) throw new CustomError( 400, 'Invalid Credentials' );

            const token: string = user.id;
            return token;

        } catch ( error: any ) {
            throw new CustomError( 500, error.message );
        }

    }


    getThe10UsersWithTheHighestScore = async () => {

        try {

            const result = await this.UserData.getThe10UsersWithTheHighestScore();
            return result;

        } catch ( error: any ) {
            throw new CustomError( 500, error.message );
        }

    }


}