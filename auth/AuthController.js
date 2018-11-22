const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: flase }));
router.use(bodyParser.json());
const User = require('../user/User');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');

// register
router.post('/register', (req, res) => {
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);

    User.create({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    },
    (err, user) => {
        if (err) return res.status(500).send('There was a problem registering this user');
        const token = jwt.sign({ id: user._id }, config.secret, {
            expiresIn: 86400
        });
        res.status(200).send({ auth: true, token: token });
    });
});
