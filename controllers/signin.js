const handleSignin = (req, res, db, bcrypt)=> {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json('incorrect login submission')
    }
    // console.log(email, password);
    const query1 = {
        text: 'SELECT email, hash FROM login WHERE email = $1',
        values: [email],
    }

    const query2 = {
        text: 'SELECT * FROM users WHERE email = $1',
        values: [email],
    }

    db.query(query1, (err, data) => {
        if (err) res.status(400).json("unable to read from database")
        const isValid = bcrypt.compareSync(password, data.rows[0].hash);
        if (isValid) {
            return db.query(query2, (err, user) => {
                if (err) throw err;
                res.json(user.rows[0])
            })
        }else {
            res.status(400).json(data.rows[0].hash)
        }
    });
}

export {handleSignin};