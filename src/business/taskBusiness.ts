
import { Task } from '@prisma/client';
import { TaskData } from './../data/taskData';
import { CustomError } from '../models/customError';
import { UserData } from '../data/userData';
import { TaskModel } from './../models/taskModel';
import { Authenticator } from '../services/authenticator';
import { AuthenticationData } from '../types/Authenticator';


export class TaskBusiness {


    constructor(
        private taskData: TaskData,
        private userData: UserData,
        private authenticator: Authenticator

    ) { }

    getAllTasks = async ( token: string ): Promise<string | Task[]> => {

        try {

            const tokenData = this.authenticator.getTokenData( token ) as AuthenticationData;
            if ( !tokenData.id ) throw new CustomError( 401, "invalid token or empty token" );

            const userExist = await this.userData.checkIfUserExists( tokenData.id );
            if ( !userExist ) throw new CustomError( 404, "user not found" );

            const tasks = await this.taskData.getAllTasks( tokenData.id );
            return tasks;

        } catch ( error: any ) {
            throw new CustomError( 404, error.message )
        }


    }

    getDeletedTasks = async ( token: string ): Promise<string | Task[]> => {


        try {

            const tokenData = this.authenticator.getTokenData( token ) as AuthenticationData;
            if ( !tokenData.id ) throw new CustomError( 401, "invalid token or empty token" );

            const userExist = await this.userData.checkIfUserExists( tokenData.id );
            if ( !userExist ) throw new CustomError( 404, "user not found" );

            const deletedTasks = await this.taskData.getDeletedTasks( tokenData.id );
            return deletedTasks;

        } catch ( error: any ) {
            throw new CustomError( 404, error.message )
        }
    }

    createTask = async ( task: string, tag: string, token: string ) => {

        try {

            if ( !tag || !task ) throw new CustomError( 404, "one or more fields are empty" )

            const tokenData = this.authenticator.getTokenData( token ) as AuthenticationData;
            if ( !tokenData.id ) throw new CustomError( 401, "invalid token or empty token" );

            if ( typeof tag !== "string" || typeof task !== "string" || typeof tokenData.id !== "string"
            ) throw new CustomError( 404, "only text type is accepted" )

            const duplicatedTask = await this.taskData.checkIfTaskAlreadyExist( task, tokenData.id );
            if ( duplicatedTask ) throw new CustomError( 404, "there is already a task with that name" );

            await this.taskData.createTask( new TaskModel( tokenData.id, task, tag ) );

        } catch ( error: any ) {
            throw new CustomError( 404, error.message )
        }

    }


    changeTheTaskStatus = async ( taskId: string, token: string ) => {

        try {

            const tokenData = this.authenticator.getTokenData( token ) as AuthenticationData;
            if ( !tokenData.id ) throw new CustomError( 401, "invalid token or empty token" );
            if ( typeof tokenData.id !== "string" ) throw new CustomError( 404, "token needs to be a string" );

            if ( !taskId ) throw new CustomError( 404, "task id is not valid" );

            const task = await this.taskData.getTaskById( tokenData.id );

            if ( task?.status === true ) throw new CustomError( 404, "task already marked as completed" )
            if ( !task ) throw new CustomError( 404, "task not found" );
            if ( task?.userId !== tokenData.id ) throw new CustomError( 404, "you do not have permission to perform this action" );

            await this.taskData.changeTheTaskStatus( tokenData.id, taskId );

        } catch ( error: any ) {
            throw new CustomError( 404, error.message )
        }
    }


    deleteTask = async ( taskId: string, token: string ) => {

        try {

            const tokenData = this.authenticator.getTokenData( token ) as AuthenticationData;
            if ( !tokenData.id ) throw new CustomError( 401, "invalid token or empty token" );
            if ( typeof tokenData.id !== "string" ) throw new CustomError( 404, "token needs to be a string" );


            if ( !taskId ) throw new CustomError( 404, "task id is not valid" );
            if ( typeof tokenData.id !== "string" ) throw new CustomError( 404, "token needs to be a string" );

            const task = await this.taskData.getTaskById( taskId );
            if ( !task ) throw new CustomError( 404, "task not found" );
            if ( task?.userId !== token ) throw new CustomError( 404, "you do not have permission to perform this action" );

            await this.taskData.deleteTask( taskId, tokenData.id );

        } catch ( error: any ) {
            throw new CustomError( 404, error.message )
        }

    }


}