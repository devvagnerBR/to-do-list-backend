import cors from "cors";
import express from "express";
import { userRouter } from "./router/userRouter";
import { taskRouter } from "./router/taskRouter";

const port = process.env.PORT || 3003;
const app = express();

app.use( express.json() );
app.use( cors() );
app.options( '*', cors() );

const server = app.listen( port, () => {
    if ( server ) console.log( `The server is running on localhost:${port}` );
    else console.log( 'Error running the server' );
} );


app.use( userRouter )
app.use( taskRouter )
