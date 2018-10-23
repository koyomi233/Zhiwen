let Picture = require('../models/picture');
let Collection = require('../models/collection');
let express = require('express');
let router = express.Router();

//Find all pictures
router.findAll = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Picture.find(function(err, pic) {
        if (err)
            res.send(err);

        res.send(JSON.stringify(pic, null, 5));
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
    Picture.count(_filter, function(err, pic){
        if (err){
            res.json({errmsq : err});
        }else{
            count = pic;
        }
    });

    Picture.find(_filter).limit(10).sort({"_id" : -1}).exec(function(err, pic){
        if (err || pic.length == 0){
            res.json({message: "Picture NOT Found!", errmsq : err});
        }else{
            res.send(JSON.stringify(pic, null, 5));
        }
    });
}

//Find a picture's collection
router.findItsCollection = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Picture.findOne({"_id" : req.params.id}).populate('collectionid').exec(function(err, pic){
        if (err){
            res.json({message: "No Such Picture!", errmsq: err});
        }else{
            res.json({message: pic.name + " is collected in " + pic.collectionid.name, data: pic});
        }
    });
}

//Add a picture
router.addPicture = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    var picture = new Picture();

    picture.collectionid = req.body.collectionid;
    picture.name = req.body.name;
    picture.describe = req.body.describe;
    picture.comment = req.body.comment;

    picture.save(function(err) {
        if (err)
            res.json({ message: 'Picture NOT Added!', errmsg : err } );
        else{
            //The size of collection should increase
            Collection.findById(picture.collectionid, function(err,collection) {
                if (err)
                    res.send(err);
                else {
                    collection.size += 1;
                    collection.save(function(err){
                        if (err)
                            res.send(err);
                        else
                            res.json({ message: 'Picture Successfully Added!' +
                                " The size of " + collection.name + " now is " +
                                collection.size, data: picture });
                    });
                }
            });
        }
    });
}

//Delete a picture
router.deletePicture = (req, res) => {
    //Delete a selected picture by id
    Picture.findByIdAndRemove({"_id" : req.params.id})
        .populate('collectionid')
        .exec(function(err, pic) {
        if (err)
            res.json({ message: 'No such Picture, Picture NOT DELETED!', errmsg : err } );
        else{
            //The size of collection should decrease
            Collection.findById(pic.collectionid, function(err,collection) {
                if (err)
                    res.send(err);
                else {
                    collection.size -= 1;
                    collection.save(function(err){
                        if (err)
                            res.send(err);
                        else
                            res.json({ message: 'Picture Successfully DELETED!' +
                                    " The size of " + collection.name + " now is " +
                                    collection.size});
                    });
                }
            });
        }
    });
}

//Add a comment
router.addComment = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Picture.update({_id: req.params.id}, {$addToSet: {comment: [req.body.comment]}}, function(err, pic) {
        if (err)
            res.json({ message: 'Picture NOT Found!', errmsg : err } );
        else {
            res.json({ message: 'Comment Saved!'});
        }
    });
}

//Change a describe
router.changeDescribe = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Picture.findById(req.params.id, function(err, pic) {
        if (err)
            res.json({ message: 'Picture NOT Found!', errmsg : err } );
        else {
            pic.describe = req.body.describe;
            pic.save(function (err) {
                if (err)
                    res.send(err);
                else
                    res.json({ message: 'Describe Saved! Describe: ' + pic.describe});
            });
        }
    });

}




module.exports = router;