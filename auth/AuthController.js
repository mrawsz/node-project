const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
const User = require('../user/User');
const VerifyToken = require('./VerifyToken');

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
//
router.get('/me', VerifyToken, (req, res, next) => {
    const token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided'});

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token'});

    User.findById(decoded.id, { password: 0 }, (err, user) => {
        if (err) return res.status(500).send('There was a problem finding user');
        if (!user) return res.status(404).send('User not found');

        //res.status(200).send(user);
        next(user);
    });
    });
});

router.use((user, req, res, next) => res.status(200).send(user));

router.post('/login', (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (err) return res.status(500).send('Error on the server');
        if (!user) return res.status(404).send('No user found');

        const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null});

        const token = jwt.sign({ id: user._id }, config.secret, { expiresIn: 86400 });

        res.status(200).send({ auth: true, token: token});
    });
});
// logout
router.get('/logout', (req, res) => {
    res.status(200).send({ auth: false, token: null });
});

module.exports = router;