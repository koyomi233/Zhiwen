let Picture = require('../models/picture');
let Collection = require('../models/collection');
let User = require('../models/user');
let express = require('express');
let router = express.Router();

//Find all users
router.findAll = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    User.find(function(err, account) {
        if (err)
            res.send(err);

        res.send(JSON.stringify(account, null, 5));
    });
}

//Find by email
router.findOneById = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    User.find({ "email" : req.params.email },function(err, account) {
        if (err)
            res.json({ message: 'User NOT Found!', errmsg : err } );
        else
            res.send(JSON.stringify(account, null, 5));
    });
}

//Find by name
router.findByName = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    var keyword = req.params.name;
    var _filter = {
        $or: [
            {name: {$regex: keyword, $options: '$i'}}
        ]
    };
    var count = 0;
    User.count(_filter, function(err, account){
        if (err){
            res.json({errmsq : err});
        }else{
            count = account;
        }
    });

    User.find(_filter).limit(10).sort({"_id" : -1}).exec(function(err, account){
        if (err || account.length == 0){
            res.json({message: "User NOT Found!", errmsq : err});
        }else{
            res.send(JSON.stringify(account, null, 5));
        }
    });
}

//Add a user
router.addUser = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    var user = new User();

    user.name = req.body.name;
    user.password = req.body.password;
    user.email = req.body.email;
    user.collectionid = req.body.collectionid;
    user.fans = req.body.fans;
    user.follows = req.body.follows;

    user.save(function(err) {
        if (err)
            res.json({ message: 'User NOT Added!', errmsg : err } );
        else
            res.json({ message: 'User Successfully Added!', data: user });
    });
}

//Delete a user
router.deleteUser = (req, res) => {
    User.findByIdAndRemove(req.params.id, function(err) {
        if (err)
            res.json({ message: 'User NOT DELETED!', errmsg : err } );
        else{
            res.json({ message: 'User Successfully DELETED!'});
        }

    });
}

//Add fans
router.addFans = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    User.update({_id: req.params.id}, {$addToSet: {fans: [req.body.fans]}}, function(err, account) {
        if (err)
            res.send(err);
        else {
            res.json({ message: 'A New User has Followed you!', data: account});
        }
    });
}

//Add follows
router.addFollows = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    User.update({_id: req.params.id}, {$addToSet: {follows: [req.body.follows]}}, function(err, account) {
        if (err)
            res.send(err);
        else {
            User.update({_id: req.body.follows}, {$addToSet: {fans: [req.params.id]}}, function(err){
                if (err)
                    res.send(err)
                else
                    res.json({ message: 'You have followed a new user!', data: account});
            });
        }
    });
}

//Delete follows
router.removeFollows = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    User.update({_id: req.params.id}, {'$pull': {follows: req.body.follows}}, function(err, account) {
        if (err)
            res.send(err);
        else {
            User.update({_id: req.body.follows}, {'$pull': {fans: req.params.id}}, function(err){
                if (err)
                    res.send(err)
                else
                    res.json({ message: 'You have removed the follow on this user!', data: account});
            });
        }
    });
}

//Add a private board
router.addBoards = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    User.update({_id: req.params.id}, {$addToSet: {collectionid: req.body.collectionid}}, function(err, account){
        if (err)
            res.send(err);
        else
            res.json({message: "You Create a New Board!"});
    })
}

//Remove a private board
router.removeBoards = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    User.update({_id: req.params.id}, {$pull: {collectionid: req.body.collectionid}}, function(err){
        if (err)
            res.send(err);
        else{
            //private boards should be remove as well
            Collection.findByIdAndRemove(req.body.collectionid, function(err) {
                if (err)
                    res.json({ message: 'Collection NOT DELETED!', errmsg : err } );
                else{
                    //The pictures in this collection should be removed too
                    Picture.remove({collectionid: req.body.collectionid}).exec(function(err, pic){
                        if (err)
                            res.send(err);
                        else
                            res.json({ message: 'The board have been removed from your list!'});
                    });
                }

            });
        }
    })
}

module.exports = router;