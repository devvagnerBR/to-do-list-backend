import { IdGenerator } from "../services/IdGenerator";


export class TaskModel {

    private id: string;
    private status: boolean;


    constructor(

        private userId: string,
        private task: string,
        private tag: string

    ) {

        this.id = new IdGenerator().generateID()
        this.status = false
    }

    getId(): string {
        return this.id
    }
    getStatus(): boolean {
        return this.status
    }

    getUserId(): string {
        return this.userId
    }

    getTaskName(): string {
        return this.task
    }
    getTag(): string {
        return this.tag
    }

}