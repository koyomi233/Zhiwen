var Collection = require('../../models/collection');
var Picture = require('../../models/picture');
var User = require('../../models/user');

beforeEach(function(done){
    var collection1 = new Collection({
        _id: '5bceef76b42bc703dde7da06',
        category: 'Animation',
        name: 'Japanese illustration',
        size: 123,
        follow: 7
    });
    collection1.save();
    done();
});

beforeEach(function(done){
    var collection2 = new Collection({
        _id: '5bceef76b42bc703dde7da07',
        category: 'sketch',
        name: 'Black and White',
        size: 34,
        follow: 0
    });
    collection2.save();
    done();
});

beforeEach(function(done){
    var collection3 = new Collection({
        _id: '5bcef1bff16ce3040a5d7dcb',
        category: 'photography',
        name: 'Girls!',
        size: 85,
        follow: 12
    });
    collection3.save();
    done();
});

beforeEach(function(done){
    var picture1 = new Picture({
        _id: '5bcde76cfb6fc060274aecb2',
        collectionid: '5bceef76b42bc703dde7da07',
        name: 'City',
        describe: '',
        comment: []
    });
    picture1.save();
    done();
});

beforeEach(function(done){
    var picture2 = new Picture({
        _id: '5bcde78efb6fc060274aecbb',
        collectionid: '5bcef1bff16ce3040a5d7dcb',
        name: 'City Life',
        describe: '',
        comment: []
    });
    picture2.save();
    done();
});

beforeEach(function(done){
    var picture3 = new Picture({
        _id: '5bcde7e0fb6fc060274aecfe',
        collectionid: '5bceef76b42bc703dde7da06',
        name: 'character',
        describe: '',
        comment: []
    });
    picture3.save();
    done();
});

beforeEach(function(done){
    var user1 = new User({
        _id: '5bcde909fb6fc060274aedf5',
        name: 'soundtrack',
        password: '123456',
        email: '317657452@qq.com',
        collectionid: [],
        fans: [],
        follows: []
    });
    user1.save();
    done();
});

beforeEach(function(done){
    var user2 = new User({
        _id: '5bcde933fb6fc060274aee1a',
        name: 'koyomi',
        password: 'hasdakckjhasd',
        email: '317657452h@sina.com',
        collectionid: [],
        fans: [],
        follows: []
    });
    user2.save();
    done();
});

beforeEach(function(done){
    var user3 = new User({
        _id: '5bcde96cfb6fc060274aee4c',
        name: 'Shinobu',
        password: '98871najsdja',
        email: '317657452h@126.com',
        collectionid: [],
        fans: [],
        follows: []
    });
    user3.save();
    done();
});
