
export class User {

    constructor(

        private id: string,
        private username: string,
        private password: string,

    ) { }

    getId(): string {
        return this.id
    }
    getUsername(): string {
        return this.username
    }
    getPassword(): string {
        return this.password
    }

}
