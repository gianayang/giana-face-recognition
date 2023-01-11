import express from 'express';
import bcrypt from 'bcrypt-nodejs';
import cors from 'cors';
import knex from 'knex';
import {handleRegister} from './controllers/register.js';
import {handleSignin} from './controllers/signin.js';

const app = express();
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cors());

const db = knex({
    client: 'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    }
});

app.get('/', (req, res)=> {
    res.send('This is working!!!');
})

app.post('/signin', (req, res) => {handleSignin(req, res, db, bcrypt)})

app.post('/register', (req, res) => {handleRegister(req, res, db, bcrypt)})

app.get('/profile/:id', (req, res) => {
    const { id } = req.params;
    db.select('*').from('users').where({id})
    .then(user => {
        if (user.length) {
            res.json(user[0])
        } else {
            res.status(400).json('user not found')
        }
    }).catch(err => res.status(400).json('user not found'))
})

app.put('/image', (req, res) => {
    const {id} = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        res.json(entries[0].entries)
    })
    .catch(err=> res.status(400).json('unable to get image entries'))
})

app.listen(process.env.PORT ||3000 , () => {
    console.log(`app is running on port ${process.env.PORT}`);
})
// app.listen(3000 , () => {
//     console.log(`app is running on port ${process.env.PORT}`);
// })