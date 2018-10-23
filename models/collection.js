let mongoose = require('mongoose');

let CollectionSchema = new mongoose.Schema({
        category: String,
        name: String,
        size: Number,
        follow: Number
    },
    { collection: 'collections' });

module.exports = mongoose.model('collection', CollectionSchema);
