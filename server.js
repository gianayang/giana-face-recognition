import express from 'express';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import pkg from 'pg';
import {handleRegister} from './controllers/register.js';
import {handleSignin} from './controllers/signin.js';

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

const {Client} = pkg;

const db = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl:{
        rejectUnauthorized: false
    }
})
db.connect()


app.get('/', (req, res)=> {
    res.send('This is working with db!!!');
})

app.post('/signin', (req, res) => {handleSignin(req, res, db, bcrypt)})

app.post('/register', (req, res) => {handleRegister(req, res, db, bcrypt)})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    const selectIDQuery = {
        text: 'SELECT * FROM users WHERE id = $1',
        values: [id],
    }
    db.query(selectIDQuery, (err, user)=> {
        if (err) res.status(400).json('user not found')
        if (user.length) {
            res.json(user.rows[0])
        } else {
            res.status(400).json('user not found')
        }
    })
})

app.put('/image', (req, res) => {
    const {id} = req.body;
    incrementQuery = {
        text: 'UPDATE users SET entries = entries + 1 WHERE id = $1 RETURNING entries',
        values: [id]
    }
    db.query(incrementQuery, (err, entries) => {
        if (err) res.status(400).json("cannot update entries")
        res.json(entries[0].entries)
    })
})

app.listen(process.env.PORT ||3000 , () => {
    console.log(`app is running on port ${process.env.PORT}`);
})