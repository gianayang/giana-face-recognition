import { query } from "express";

const handleRegister = async (req, res, db, bcrypt) => {
    const {email, name, password} = req.body;
    
    //empty input
    if(!email || !name || !password){
        return res.status(400).json('incorrect form submission')
    }
    try{
        const hash = bcrypt.hashSync(password);
        const query1 = 'INSERT INTO login(hash, email) VALUES($1, $2) RETURNING email'
        const res = await db.query(query1,[hash, email])

        const insertINTOusers = 'INSERT INTO users(email, name, joined) VALUES($1, $2, $3)'
        const values = [res.rows[0].email, name, new Date()]
        await db.query(insertINTOusers, values, (err, user) => {
            res.json(user.rows[0]);
        })
        await db.query('COMMIT')
    }catch (e) {
        await db.query('ROLLBACK')
        throw e
    }
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