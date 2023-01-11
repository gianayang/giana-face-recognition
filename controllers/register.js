import { query } from "express";
// import pkg from "pg";

// const {Pool} = pkg;

// const pool = new Pool()

const handleRegister = async (req, res, db, bcrypt) => {
    const {email, name, password} = req.body;
    
    //empty input
    if(!email || !name || !password){
        return res.status(400).json('incorrect form submission')
    }

    try{
        await db.query('BEGIN')
        const hash = bcrypt.hashSync(password);
        const query1 = 'INSERT INTO login(hash, email) VALUES($1, $2) RETURNING email'
        const values1 = [hash, email]
        const data = await db.query(query1, values1)

        const insertINTOusers = 'INSERT INTO users(email, name, joined) VALUES($1, $2, $3)'
        const values = [data.rows[0].email, name, new Date()]
        await db.query(insertINTOusers, values, (err) => {
            if (err) {
                return res.status(400).json('cannot add to users table');
            }
            const query2 = {
                text: 'SELECT * FROM users WHERE email = $1',
                values: [email],
            }
            return db.query(query2, (err, user) =>{
                if (err) {
                    return res.status(400).json('cannot select user from users table');
                }
                res.json(user.rows[0])
            })
        })
        await db.query('COMMIT')
    } catch (e) {
        await db.query('ROLLBACK')
        throw e
    }
}

export {handleRegister};