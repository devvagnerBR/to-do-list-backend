
import { Task } from '@prisma/client';
import { TaskData } from './../data/taskData';
import { CustomError } from '../models/customError';
import { UserData } from '../data/userData';
import { TaskModel } from './../models/taskModel';


export class TaskBusiness {


    constructor(
        private taskData: TaskData,
        private userData: UserData,

    ) { }

    getAllTasks = async ( token: string ): Promise<string | Task[]> => {

        try {

            if ( !token ) throw new CustomError( 409, "user is not logged in" );

            const userExist = await this.userData.checkIfUserExists( token );

            if ( !userExist ) throw new CustomError( 404, "user not found" );

            const tasks = this.taskData.getAllTasks( token );

            return tasks;

        } catch ( error: any ) {
            throw new CustomError( 404, error.message )
        }


    }


    createTask = async ( task: string, tag: string, token: string ) => {

        try {

            if ( !tag || !task ) throw new CustomError( 404, "one or more fields are empty" )
            if ( !token ) throw new CustomError( 404, "user not found" )

            if ( typeof tag !== "string" || typeof task !== "string" || typeof token !== "string"
            ) throw new CustomError( 404, "only text type is accepted" )

            const NewTaskModel: TaskModel = new TaskModel( token, task, tag );
            await this.taskData.createTask( NewTaskModel );

        } catch ( error: any ) {
            throw new CustomError( 404, error.message )
        }

    }


    changeTheTaskStatus = async ( taskId: string, token: string ) => {

        try {

            if ( !taskId ) throw new CustomError( 404, "task id is not valid" );
            if ( !token ) throw new CustomError( 404, "user not found" );
            if ( typeof token !== "string" ) throw new CustomError( 404, "token needs to be a string" );

            const task = await this.taskData.getTaskById( taskId );

            if ( task?.status === true ) throw new CustomError( 404, "task already marked as completed" )
            if ( !task ) throw new CustomError( 404, "task not found" );
            if ( task?.userId !== token ) throw new CustomError( 404, "you do not have permission to perform this action" );

            await this.taskData.changeTheTaskStatus( token, taskId );

        } catch ( error: any ) {
            throw new CustomError( 404, error.message )
        }
    }


    deleteTask = async ( taskId: string, token: string ) => {

        try {

            if ( !taskId ) throw new CustomError( 404, "task id is not valid" );
            if ( !token ) throw new CustomError( 404, "user not found" );
            if ( typeof token !== "string" ) throw new CustomError( 404, "token needs to be a string" );

            const task = await this.taskData.getTaskById( taskId );
            if ( !task ) throw new CustomError( 404, "task not found" );
            if ( task?.userId !== token ) throw new CustomError( 404, "you do not have permission to perform this action" );

            await this.taskData.deleteTask( taskId, token );

        } catch ( error: any ) {
            throw new CustomError( 404, error.message )
        }

    }

}