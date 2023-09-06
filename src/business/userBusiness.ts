import { UserData } from './../data/userData';
import { IdGenerator } from '../services/IdGenerator';
import { CustomError } from '../models/customError';
import { Authenticator } from '../services/authenticator';
import { AuthenticationData } from '../types/Authenticator';
import { HashManager } from '../services/hashManager';


export class UserBusiness {


    constructor(
        private userData: UserData,
        private idGenerator: IdGenerator,
        private authenticator: Authenticator,
        private hashManager: HashManager
    ) { }

    signup = async ( username: string, password: string ) => {

        try {

            if ( !username || !password ) throw new CustomError( 404, "one or more fields are empty" );
            if ( username.length < 3 ) throw new CustomError( 400, "username field must be greater than 3" );
            if ( password.length < 6 ) throw new CustomError( 400, "Password must contain 6 characters or more" );

            const hasUsername = await this.userData.getUserByUsername( username );

            if ( hasUsername ) throw new CustomError( 409, "username already in use" );
            if ( username.includes( " " ) ) throw new CustomError( 400, "username cannot contain white space" );

            const id: string = this.idGenerator.generateID()

            const passwordAsHash = await this.hashManager.createHash( password );

            await this.userData.signup( id, username.toLocaleLowerCase(), passwordAsHash );

            const token: string = this.authenticator.generateToken( { id: id } );
            return token;

        } catch ( error: any ) {
            throw new CustomError( error.statusCode, error.message )
        }

    }

    getUserById = async ( token: string ) => {



        try {

            const tokenData = this.authenticator.getTokenData( token ) as AuthenticationData;
            if ( !tokenData.id ) throw new CustomError( 401, "invalid token or empty token" );
            if ( typeof tokenData.id !== "string" ) throw new CustomError( 404, "token needs to be a string" );

            const checkUser = await this.userData.checkIfUserExists( tokenData.id );
            if ( !checkUser ) throw new CustomError( 404, "user not found" )

            const result = await this.userData.getUserByID( tokenData.id );
            return result;

        } catch ( error: any ) {
            throw new CustomError( error.statusCode, error.message )
        }
    }


    login = async ( username: string, password: string ) => {

        try {

            if ( !username || !password ) throw new CustomError( 400, 'one or more fields are empty' );

            const user = await this.userData.getUserByUsername( username );
            if ( !user ) throw new CustomError( 403, 'user not found' );

            const validatePassword = await this.hashManager.compareHash( password, user.password )
            if ( !validatePassword ) throw new CustomError( 401, 'incorrect password' );

            const token: string = this.authenticator.generateToken( { id: user.id } )
            return token;

        } catch ( error: any ) {
            throw new CustomError( error.statusCode, error.message )
        }

    }

    getThe10UsersWithTheHighestScore = async () => {

        try {

            const result = await this.userData.getThe10UsersWithTheHighestScore();
            return result;

        } catch ( error: any ) {
            throw new CustomError( 500, error.message );
        }

    }


}