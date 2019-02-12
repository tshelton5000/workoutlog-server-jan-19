var router = require('express').Router();
var sequelize = require('../db');
var User = sequelize.import('../models/user');
var Log = sequelize.import('../models/log');

router.get('/', function (req, res){
    let userid = req.user.id;

    Log.findAll({where: {owner: userid}})
        .then(
            function findAllSuccess(data){
                res.json(data);
            },
            function findAllError(err){
                res.send(500, err.message);
            }
        )
})

router.post('/', function (req, res){
    let desc = req.body.log.description;
    let def = req.body.log.definition;
    let result = req.body.log.result;
    let owner = req.user.id;

    Log
    .create({
        description: desc,
        definition: def,
        result: result,
        owner: owner
    })
    .then(
        function createSuccess(logdata){
            res.json({
                logdata: logdata
            })
        },
        function createError(err){
            res.send(500, err.message);
        }
    )
})

router.get('/:id', function(req, res){
    let data = req.params.id;
    let userid = req.user.id;

    Log
        .findOne({
            where: {id: data, owner: userid}
        }).then(
            function findOneSuccess(data){
                res.json(data);
            },
            function findOneError(err){
                res.send(500, err.message);
            }
        )
})

router.put('/:id', function(req, res){
    let updateId = req.params.id;
    let updateDesc = req.body.log.description;
    let updateDef = req.body.log.definition;
    let updateRes = req.body.log.result;
    let updateOwner = req.user.id;

    Log
        .update({
            description: updateDesc,
            definition: updateDef,
            result: updateRes,
            owner: updateOwner
        }, {where: {id: updateId}})
        .then(
            function updateSuccess(){
                res.json({
                    description: updateDesc,
                    definition: updateDef,
                    result: updateRes,
                    owner: updateOwner
                })
            }, 
            function updateError(err){
                res.send(500, err.message);
            }
        )
})

router.delete('/:id', function (req, res){
    let data = req.params.id;
    let userId = req.user.id;

    Log 
        .destroy({
            where: {id: data, owner: userId}
        })
        .then(
            function deleteLogSuccess(){
                res.send("you removed a log");
            },
            function deleteLogError(err){
                res.send(500, err.message);
            }
        )
})

module.exports = router;