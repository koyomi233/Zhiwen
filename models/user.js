let mongoose = require('mongoose');

let UserSchema = new mongoose.Schema({
        name: {type: String, required: true},
        password: {type: String, required: true},
        email: {type: String, unique: true},
        collectionid: [{type: mongoose.Schema.ObjectId, unique: true, ref: 'collection'}],
        fans: [{type: mongoose.Schema.ObjectId, unique: true}],
        follows: [{type: mongoose.Schema.ObjectId, unique: true}]
    },
    {collection: 'users'});

module.exports = mongoose.model('user', UserSchema);