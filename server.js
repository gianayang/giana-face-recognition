import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import knex from 'knex';
import {handleRegister} from './controllers/register.js';
import {handleSignin} from './controllers/signin.js';
import {handleProfile} from './controllers/profile.js';
import {handleImage, handleApiCall} from './controllers/image.js';

const app = express();
app.use(bodyParser.json());
app.use(cors());
const db = knex({
    client: 'pg',
    connection:{
        host: '127.0.0.1',
        user: 'postgres',
        password: '123',
        database: 'smartbrain'
    }
});

const PORT = process.env.DATABASE_URL

app.get('/', (req, res)=> {
    console.log()
    res.send(database.users);});

app.post('/signin', (req, res) => {handleSignin(req, res, db, bcrypt)})

app.post('/register', (req, res) => {handleRegister(req, res, db, bcrypt) })

app.get('/profile/:id', (req, res) => {handleProfile(req, res, db, bcrypt)})

app.put('/image', (req, res) => {handleImage(req, res, db)})

app.post('/imageurl', (req, res) => {handleApiCall(req, res)})

app.listen(3000, ()=> {console.log(`app is running on port ${DATABASE_URL}` );})

/*
/ --> res = this is working 
/signin --> POST success/fail
/register --> POST = user
/profile/:userId --> GET = user
/image --> PUT --> user
*/