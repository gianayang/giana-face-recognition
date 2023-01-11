const handleSignin = (req, res, db, bcrypt)=> {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json('incorrect login submission')
    }
    console.log(email, password);
    db.select('email','hash').from('login')
    .where('email', '=', email)
    db.query(`SELECT email, hash FROM login WHERE email = ${email};`, (err, data) => {
        if (err) throw err;
        const isValid = bcrypt.compareSync(password, data[0].hash);
        res.json(user[0])
        if (isValid) {
            return db.select('*').from('users')
            .where('email', '=', email)
            .then(user => {
                res.json(user[0])
            })
            .catch(err => res.status(400).json('unable to get user'))
        }else {
            res.status(400).json(data[0].hash)
        }
    });
}

export {handleSignin};