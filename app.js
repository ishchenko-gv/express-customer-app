const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const expressValidator = require('express-validator');
const mongojs = require('mongojs');
const db = mongojs('expressCustomerApp', ['users']);
const ObjectId = mongojs.ObjectId;

const app = express();

// express config
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

// globals
app.use(function (req, res, next) {
    res.locals.errors = null;
    next();
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({extended: false}));
app.use(expressValidator());

app.get('/', function (req, res) {
    db.users.find(function (err, docs) {
        if (err) {
            console.log(err);
        } else {
            app.locals.users = docs;
            res.render('index', {
                title: 'Customer App',
                users: app.locals.users
            });
        }
    });
});

app.post('/users/add', function (req, res) {

    req.checkBody('firstname', 'First name is required').notEmpty();
    req.checkBody('lastname', 'Last name is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();

    let errors = req.validationErrors();

    if (errors) {
        res.render('index', {
            title: 'Customer App',
            users: app.locals.users,
            errors: errors
        })
    } else {
        let newUser = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email
        };
        db.users.insert(newUser, function (err, result) {
            if (err) {
                console.log(err);
            }
            res.redirect('/');
        });
    }
});

app.delete('/users/delete/:id', function (req, res) {
    db.users.remove({_id: ObjectId(req.params.id)}, function (err, result) {
        if (err) {
            console.log(err)
        }
    });
});

app.listen(4000, function () {
    console.log('Server running on port 4000');
});