const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: true}));
router.use(bodyParser.json());

const User = require('./User');

// creating new user
router.post('/', (req, res) => {
    User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    },
    (err, user) => {
        if (err) return res.status(500).send('there was a problem');
        res.status(200).send(user);
    });
});

// return users from the database
router.get('/', (req, res) => {
    User.find({}, (err, users) => {
        if (err) return res.status(500).send('There was a problem finding users');
        res.status(200).send(users);
    });
});

// get single user
router.get('/:id', (req, res) => {
    User.findById(req.params.id, (err, user) => {
        if (err) return res.status(500).send('There was a problem finding user');
        if (!user) return res.status(404).send('There is no such a user');
        res.status(200).send(user);     
    });
});

// deletes 
router.delete('/:id', (req, res) => {
    User.findByIdAndDelete(req.params.id, (err, user) => {
        if (err) return res.status(500).send('There was a problem deleting this user!');
        res.status(200).send('User ' + user.name + ' was deleted!');
    });
});

// patch is much better option. With put you replace data, with patch you update. It saves you from deleting data.
// update
router.put('/:id', (req, res) => {
    User.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, user) => {
        if (err) return res.status(500).send('There was a problem updating it');
        if (!user) return res.status(404).send('There is no such a user');
        res.status(200).send('Updated data for ' + user.name);
    })
})

module.exports = router;