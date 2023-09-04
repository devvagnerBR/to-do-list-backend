import { IdGenerator } from "../services/IdGenerator";


export class TaskModel {

    public id: string;
    public status: boolean;


    constructor(

        public userId: string,
        public task: string,
        public tag: string

    ) {

        this.id = IdGenerator()
        this.status = false
    }

}