import express, {Express} from 'express';
import { studentRouter, eventRouter } from './routes';
import { db } from './lib/connectionDB';
import { json } from 'stream/consumers';

const app: Express = express();

const port:number = 3000;

app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use("/students", studentRouter);
app.use("/events", eventRouter);

db.then(()=>{
    app.listen(port, '0.0.0.0', ()=>{
        console.log(`Server is running on ${port} port`);
    })
})

