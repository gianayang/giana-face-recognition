const handleSignin = (req, res, db, bcrypt)=> {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json('incorrect login submission')
    }
    console.log(email, password);
    db.select('email','hash').from('login')
    .where('email', '=', email)
    .then(data => {
        console.log(data, "password", data[0]);
        const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
        if (isValid) {
            return db.select('*').from('users')
            .where('email', '=', req.body.email)
            .then(user => {
                res.json(user[0])
            })
            .catch(err => res.status(400).json('unable to get user'))
        }else {
            res.status(400).json("wrong credentials")
        }
    })
    .catch(err => res.status(400).json("something is wrong wtih database connection"))
}

export {handleSignin};