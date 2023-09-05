import { Task } from "@prisma/client";
import { prismaClient } from "./BaseDatabase";
import { CustomError } from "../models/customError";
import { TaskModel } from "../models/taskModel";


export class TaskData {


    getAllTasks = async ( token: string ) => {

        try {

            const tasks: Task[] = await prismaClient.task.findMany( {
                where: { userId: token, deleted: false },
                orderBy: { created_at: 'desc' }
            } )

            return tasks;

        } catch ( error: any ) {
            throw new CustomError( 500, error.message )
        }
    }

    createTask = async ( newTask: TaskModel ) => {

        try {

            await prismaClient.task.create( {

                data: {
                    id: newTask.id,
                    userId: newTask.userId,
                    status: newTask.status,
                    task: newTask.task,
                    tag: newTask.tag,
                }
            } )

            await prismaClient.user.update( {
                where: { id: newTask.userId },
                data: {
                    tasks_quantity: {
                        increment: 1
                    },
                    tasks_pending_quantity: {
                        increment: 1
                    }
                }
            } )

        } catch ( error: any ) {
            throw new CustomError( 500, error.message )
        }
    }

    changeTheTaskStatus = async ( token: string, taskId: string ) => {

        try {

            await prismaClient.task.update( {
                where: {
                    id: taskId
                },
                data: {
                    status: true,
                    completed_at: new Date( Date.now() )
                }
            } )


            await prismaClient.user.update( {
                where: { id: token },
                data: {
                    tasks_completed_quantity: {
                        increment: 1
                    },
                    tasks_pending_quantity: {
                        increment: -1
                    }
                }
            } )

        } catch ( error: any ) {
            throw new CustomError( 500, error.message )
        }
    }


    getTaskById = async ( taskId: string ) => {

        try {

            const task = await prismaClient.task.findFirst( {
                where: { id: taskId }
            } )

            return task;


        } catch ( error: any ) {
            throw new CustomError( 500, error.message )
        }
    }


    deleteTask = async ( taskId: string, token: string ) => {

        try {

            await prismaClient.task.update( {

                where: { id: taskId, userId: token },
                data: { deleted: true }

            } )

            await prismaClient.user.update( {
                where: { id: token },
                data: {
                    tasks_quantity: {
                        increment: -1
                    }
                }
            } )

        } catch ( error: any ) {
            throw new CustomError( 500, error.message )
        }

    }


    checkIfTaskAlreadyExist = async ( taskName: string, token: string ) => {

        try {

            const result = await prismaClient.task.findFirst( {
                where: { task: taskName, userId: token }
            } )

            if ( result ) return true;
            else return false;

        } catch ( error: any ) {
            throw new CustomError( 500, error.message )
        }

    }
}
