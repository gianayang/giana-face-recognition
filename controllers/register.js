import { query } from "express";
import pkg from "pg";

const {Pool} = pkg;

const pool = new Pool()

const handleRegister = async (req, res, db, bcrypt) => {
    const {email, name, password} = req.body;
    
    //empty input
    if(!email || !name || !password){
        return res.status(400).json('incorrect form submission')
    }
    const shouldAbort = (err) =>{
        db.query('ROLLBACK', (err) => {
            if (err) {
                res.status(400).json("cannot register because ",err)
            }
        })
        return !!err
    }

    db.query('BEGIN', (err) => {
        if (shouldAbort(err)) return 
        const hash = bcrypt.hashSync(password);
        const query1 = 'INSERT INTO login(hash, email) VALUES($1, $2) RETURNING email'
        db.query(query1,[hash, email], (err, data) => {
            if (shouldAbort(err)) return

            const insertINTOusers = 'INSERT INTO users(email, name, joined) VALUES($1, $2, $3)'
            const values = [data.rows[0].email, name, new Date()]
            db.query(insertINTOusers, values, (err, user) => {
                if (shouldAbort(err)) return

                res.json(data.rows[0])
                db.query('COMMIT', (err) => {
                    if (err) {
                        res.status(400).json("cannot register because ",err)
                    }
                })
            })
            
        })
    })

    // db.transaction(trx => {
    //     trx.insert({
    //         hash: hash,
    //         email: email
    //     })
    //     .into('login')
    //     .returning('email')
    //     .then(loginemail => {
    //         return trx('users')
    //         .returning('*')
    //         .insert({
    //             email: loginemail[0].email,
    //             name: name,
    //             joined: new Date()
    //         })
    //         .then(user => {
    //             res.json(user[0]);
    //         })
    // })
    // .then(trx.commit)
    // .catch(trx.rollback)
    // })
    // .catch(err => res.status(400).json('unable to register'))
}

export {handleRegister};