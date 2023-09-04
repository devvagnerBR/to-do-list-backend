import { User } from "@prisma/client";
import { prismaClient } from "./BaseDatabase";

export class UserData {


    signup = async ( id: string, username: string, password: string ) => {

        try {

            await prismaClient.user.create( {
                data: {
                    id,
                    username,
                    password,
                }
            } )

        } catch ( error: any ) {
            throw new Error( error.message )
        }

    }

    getUserByUsername = async ( username: string ): Promise<User | null> => {

        try {

            const result: User | null = await prismaClient.user.findFirst( {
                where: { username }
            } )

            return result;

        } catch ( error: any ) {
            throw new Error( error.message )
        }
    }



    checkIfUserExists = async ( token: string ): Promise<User | null> => {

        try {

            const result = await prismaClient.user.findFirst( {
                where: { id: token }
            } )

            return result;

        } catch ( error: any ) {
            throw new Error( error.message )
        }
    }



    getUserByID = async ( token: string ) => {

        try {

            const user: User | null = await prismaClient.user.findUnique( {
                where: { id: token }
            } )

            return user;

        } catch ( error: any ) {
            throw new Error( error.message )
        }
    }
}
