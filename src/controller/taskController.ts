import { Request, Response } from 'express';
import { TaskBusiness } from '../business/taskBusiness';
import { CustomError } from '../models/customError';
import { Task } from '@prisma/client';

export class TaskController {

    constructor(
        private taskBusiness: TaskBusiness
    ) { }

    getAllTasks = async ( req: Request, res: Response ) => {

        try {

            const token: string = req.headers.authorization as string;
            const result: string | Task[] = await this.taskBusiness.getAllTasks( token );
            res.status( 200 ).send( result );

        } catch ( error: any ) {
            if ( error instanceof CustomError ) {
                res.status( error.statusCode ).send( error.message );
            } else {
                res.status( 404 ).send( error.message );
            }
        }
    }

    createTask = async ( req: Request, res: Response ) => {

        try {

            const { task, tag }: { task: string, tag: string } = req.body;
            const token = req.headers.authorization as string;

            await this.taskBusiness.createTask( task, tag, token );
            res.status( 200 ).send( { message: "task created successfully" } );

        } catch ( error: any ) {
            if ( error instanceof CustomError ) {
                res.status( error.statusCode ).send( error.message );
            } else {
                res.status( 404 ).send( error.message );
            }
        }
    }

    changeTheTaskStatus = async ( req: Request, res: Response ) => {

        try {

            const taskId = req.query.taskID as string;
            const token = req.headers.authorization as string;

            await this.taskBusiness.changeTheTaskStatus( taskId, token );
            res.status( 200 ).send( { message: "task updated successfully" } );

        } catch ( error: any ) {
            if ( error instanceof CustomError ) {
                res.status( error.statusCode ).send( error.message );
            } else {
                res.status( 404 ).send( error.message );
            }
        }
    }

    deleteTask = async ( req: Request, res: Response ) => {

        try {

            const taskId = req.query.taskID as string;
            const token = req.headers.authorization as string;

            await this.taskBusiness.deleteTask( taskId, token );
            res.status( 200 ).send( { message: "task removed successfully" } );

        } catch ( error: any ) {
            if ( error instanceof CustomError ) {
                res.status( error.statusCode ).send( error.message );
            } else {
                res.status( 404 ).send( error.message );
            }
        }

    }


}