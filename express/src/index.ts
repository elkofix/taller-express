import express, {Express} from 'express';
import { eventRouter } from './routes';
import { userRouter } from './routes/user.route';
import { authRouter } from './routes/auth.route';
import { db } from './lib/connectionDB';
import { json } from 'stream/consumers';
import { Server } from 'http';

export const app: Express = express();

const port:number = 3000;

app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use("/user", userRouter);
app.use("/events", eventRouter);
app.use("/auth", authRouter);

let server: Server; // Declarar la variable server

db.then(() => {
    server = app.listen(port, '0.0.0.0', () => {
        console.log(`Server is running on ${port} port`);
    });
}).catch((error) => {
    console.error("Database connection failed", error);
});

export { server };
