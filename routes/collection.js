let Collection = require('../models/collection');
let Picture = require('../models/picture');
let express = require('express');
let router = express.Router();


//Get all boards
router.findAll = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Collection.find(function(err, collection) {
        if (err)
            res.send(err);

        res.send(JSON.stringify(collection,null,5));
    });
}

//Get boards in a category
router.findCategory = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    var keyword = req.params.category;
    var _filter = {
        $or: [
            {category: {$regex: keyword, $options: "$i"}}
        ]
    };
    var count = 0;
    Collection.count(_filter, function(err, cate){
        if (err){
            res.json({errmsq : err});
        } else{
            count = cate;
        }
    });

    Collection.find(_filter).limit(10).exec(function(err, board){
        if (err || board.length == 0){
            res.json({message: "No Collection in this category!",errmsq : err});
        }else{
            res.send(JSON.stringify(board, null, 5));
        }
    });
}

//Find a board
router.findOneById = (req, res) => {                //Find by ID
    res.setHeader('Content-Type', 'application/json');

    Collection.find({ "_id" : req.params.id },function(err, board) {
        if (err)
            res.json({ message: 'Collection NOT Found!', errmsg : err } );
        else
            res.send(JSON.stringify(board,null,5));
    });
}

router.findOneByName = (req, res) => {              //Find by name
    res.setHeader('Content-Type', 'application/json');

    var keyword = req.params.name;
    var _filter = {
        $or: [
            {name: {$regex: keyword, $options: '$i'}}
        ]
    };
    var count = 0;
    Collection.count(_filter, function(err, pic){
        if (err){
            res.json({errmsq : err});
        }else{
            count = pic;
        }
    });

    Collection.find(_filter).limit(10).sort({"_id" : -1}).exec(function(err, board){
        if (err || board.length == 0){
            res.json({message: "Collection NOT Found!", errmsq : err});
        }else{
            res.send(JSON.stringify(board, null, 5));
        }
    });
}

//Add a board
router.addCollection = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    var collection = new Collection();

    collection.category = req.body.category;
    collection.name = req.body.name;
    collection.size = req.body.size;
    collection.follow = req.body.follow;

    collection.save(function(err) {
        if (err)
            res.json({ message: 'Collection NOT Added!', errmsg : err } );
        else
            res.json({ message: 'Collection Successfully Added!', data: collection });
    });
}

//Add a picture, size + 1
router.incrementSize = (req, res) => {
    Collection.findById(req.params.id, function(err,collection) {
        if (err)
            res.json({ message: 'Collection NOT Found!', errmsg : err } );
        else {
            collection.size += 1;
            collection.save(function (err) {
                if (err)
                    res.json({ message: 'Picture not Added, size not changed!', errmsg : err } );
                else
                    res.json({ message: 'Picture Successfully Add, size + 1!', data: collection });
            });
        }
    });
}

//Someone follow this board, follow + 1
router.incrementFollow = (req, res) => {
    Collection.findById(req.params.id, function(err,collection) {
        if (err)
            res.json({ message: 'Collection NOT Found!', errmsg : err } );
        else {
            collection.follow += 1;
            collection.save(function (err) {
                if (err)
                    res.json({ message: 'Follow failed!', errmsg : err } );
                else
                    res.json({ message: 'Follow Successful!', data: collection });
            });
        }
    });
}

//Delete a board
router.deleteCollection = (req, res) => {
    //Delete a selected board by id
    Collection.findByIdAndRemove(req.params.id, function(err) {
        if (err)
            res.json({ message: 'Collection NOT DELETED!', errmsg : err } );
        else{
            //The pictures in this collection should be removed too
            Picture.remove({collectionid: req.params.id}).exec(function(err, pic){
                if (err)
                    res.send(err);
                else
                    res.json({ message: 'Collection and its Picture Successfully Deleted!'});
            });
        }

    });
}



module.exports = router;