

import { User } from "@prisma/client";
import { prismaClient } from "./BaseDatabase";
import { UserModel } from "../models/userModel";

export class UserData {


    signup = async ( user: UserModel ) => {


        try {

            await prismaClient.user.create( {
                data: {
                    id: user.getId(),
                    username: user.getUsername(),
                    password: user.getPassword(),
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


    getThe10UsersWithTheHighestScore = async () => {

        try {
            const topUsers: User[] = await prismaClient.user.findMany( {
                orderBy: {
                    tasks_completed_quantity: 'desc'
                },
                take: 10
            } )

            return topUsers;

        } catch ( error: any ) {
            throw new Error( error.message )
        }
    }
}
