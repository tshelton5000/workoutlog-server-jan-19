var express = require('express');
var router = express.Router();
var sequelize = require('../db');
var User = sequelize.import('../models/user');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

// router.get('/test', function(req, res){
//     res.send('this test succeeded!');
//     // let username = req.body.user.username;
//     // let pass = req.body.user.password;
// })

router.post('/user', function(req, res){
    let username = req.body.user.username;
    let pass = req.body.user.password;
    console.log('this is line 17 in apicontroller');
    User.create({
        username: username,
        passwordhash: bcrypt.hashSync(pass, 10)
    }).then(
        function createSuccess(user){
            let token = jwt.sign({id: user.id},
            process.env.JWT_SECRET, {expiresIn:60*60*24})
            res.json({
                user: user,
                message: 'created',
                sessionToken: token
            })
        },
        function createError(err){
            res.send(500, err.message);
        }
    )
})

router.post('/login', function(req, res){
    User.findOne({where: {username: req.body.user.username}}
    ).then(
        function(user){
            if (user){
                bcrypt.compare(req.body.user.password, user.passwordhash, function(err, matches){
                    if (matches){
                        var token = jwt.sign({id: user.id}, process.env.JWT_SECRET, {expiresIn: 60*60*24});
                        res.json({user: user, message: 'successfully authenticated', sessionToken: token});
                    } else {
                        res.status(502).send({error: "you failed a"});
                    }
                })
            } else {
                res.status(500).send({error: "failed to authenticate"});
            }
            },
            function(err){
                res.status(501).send({error: "you failed b"});
        }
    )
})

module.exports = router;