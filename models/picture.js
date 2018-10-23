let mongoose = require('mongoose');

let PictureSchema = new mongoose.Schema({
        collectionid: {type: mongoose.Schema.ObjectId, ref: 'collection'},
        name: String,
        describe: {type: String, default: null},
        comment: []
    },
    {collection: 'pictures'});


module.exports = mongoose.model('picture', PictureSchema);
