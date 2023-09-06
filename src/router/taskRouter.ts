import express from "express"
import { TaskBusiness } from '../business/taskBusiness';
import { TaskData } from "../data/taskData";
import { UserData } from "../data/userData";
import { TaskController } from '../controller/taskController';


const taskBusiness: TaskBusiness = new TaskBusiness( new TaskData, new UserData );
const taskController: TaskController = new TaskController( taskBusiness );


export const taskRouter = express.Router();

taskRouter.get( "/tasks", taskController.getAllTasks );

taskRouter.post( "/task", taskController.createTask );
taskRouter.put( "/task", taskController.changeTheTaskStatus );
taskRouter.delete( "/task", taskController.deleteTask );
taskRouter.get( "/task", taskController.getDeletedTasks );
