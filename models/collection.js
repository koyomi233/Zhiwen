let mongoose = require('mongoose');

let CollectionSchema = new mongoose.Schema({
        category: String,
        name: String,
        size: {Types: Number, default: 0},
        follow: {Types: Number, default: 0}
    },
    { collection: 'collections' });

module.exports = mongoose.model('collection', CollectionSchema);
