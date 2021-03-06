let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../bin/www');
let expect = chai.expect;
var Collection = require('../../models/collection');
var Picture = require('../../models/picture');
var User = require('../../models/user');

chai.use(chaiHttp);
chai.use(require('chai-things'));
let _ = require('lodash' );

require('./db_globle');

describe('Picture', () => {
    describe('GET /picture', () => {
        it('should return all the pictures in an array', function (done) {
            chai.request(server)
                .get('/picture')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(3);
                    let result = _.map(res.body, (pic) => {
                        return { _id: pic._id,
                            name: pic.name }
                    });
                    expect(result).to.include( { _id: '5bcde76cfb6fc060274aecb2', name: 'City'  } );
                    expect(result).to.include( { _id: '5bcde78efb6fc060274aecbb', name: 'City Life'  } );
                    expect(result).to.include( { _id: '5bcde7e0fb6fc060274aecfe', name: 'character'  } );
                    Collection.collection.drop();
                    Picture.collection.drop();
                    User.collection.drop();
                    done();
                });
        });
    });
    describe('GET /picture/collection/:id', () => {
        it('should return a collection where the picture exists', function (done) {
            chai.request(server)
                .get('/picture/collection/5bcde7e0fb6fc060274aecfe')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message')
                        .equal('character is collected in Japanese illustration' );
                    done();
                });
        });
        it('should return a message for invalid id', function (done) {
            chai.request(server)
                .get('/picture/collection/0000000000')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message', 'No Such Picture!' );
                    Collection.collection.drop();
                    Picture.collection.drop();
                    User.collection.drop();
                    done();
                });
        });
    });
    describe('GET /picture/names/:name', () => {
        it('should return a picture which matched the name', function (done) {
            chai.request(server)
                .get('/picture/names/city')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(2);
                    let result = _.map(res.body, (pic) => {
                        return { _id: pic._id,
                            name: pic.name }
                    });
                    expect(result).to.include( { _id: '5bcde76cfb6fc060274aecb2', name: 'City'  } );
                    expect(result).to.include( { _id: '5bcde78efb6fc060274aecbb', name: 'City Life'  } );
                    done();
                });
        });
        it('should return a message for invalid picture name', function (done) {
            chai.request(server)
                .get('/picture/names/Marvel')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message', 'Picture NOT Found!' );
                    Collection.collection.drop();
                    Picture.collection.drop();
                    User.collection.drop();
                    done();
                });
        });
    });
    describe('POST /picture', () => {
        it('should return confirmation message and update datastore', function (done) {
            let pic = {
                collectionid: '5bceef76b42bc703dde7da06' ,
                name: 'Miku',
                describe: [],
                comment: []
            };
            chai.request(server)
                .post('/picture')
                .send(pic)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message')
                        .equal('Picture Successfully Added! The size of Japanese illustration now is 124' );
                    done();
                });
        });
        after(function  (done) {
            chai.request(server)
                .get('/collection')
                .end(function(err, res) {
                    let result = _.map(res.body, (board) => {
                        return { name: board.name, size: board.size };
                    }  );
                    expect(result).to.include( { name: 'Japanese illustration', size: 124  } );
                });
            chai.request(server)
                .get('/picture')
                .end(function(err, res) {
                    let result = _.map(res.body, (pic) => {
                        return { name: pic.name };
                    }  );
                    expect(result).to.include( { name: 'Miku'  } );
                    Collection.collection.drop();
                    Picture.collection.drop();
                    User.collection.drop();
                    done();
                });
        });
    });
    describe('PUT /picture/:id/addComment', () => {
        it('should return a mesage for invaild id', function (done) {
            chai.request(server)
                .get('/picture/names/Marvel')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message', 'Picture NOT Found!' );
                    done();
                });
        });
        it('should return a message and update the comment of the picture', function (done) {
            chai.request(server)
                .put('/picture/5bcde7e0fb6fc060274aecfe/addComment')
                .send({'comment': 'zack'})
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message').equal('Comment Saved!' );
                    done();
                });
        });
        after(function  (done) {
            chai.request(server)
                .get('/picture')
                .end(function(err, res) {
                    let result = _.map(res.body, (pic) => {
                        return { name: pic.name, comment: pic.comment };
                    }  );
                    expect(result).to.include( { name: 'character', comment:['zack']  } );
                    Collection.collection.drop();
                    Picture.collection.drop();
                    User.collection.drop();
                    done();
                });
        });
    });
    describe('DELETE /picture/:id', () => {
        it('should return a message for invalid collection id', function (done) {
            chai.request(server)
                .delete('/picture/00000000000000')
                .end(function(err, res) {
                    expect(res.body).to.have.property('message', 'No such Picture, Picture NOT DELETED!');
                    done();
                });
        });
        it('should return a message and update pictures', function (done) {
            chai.request(server)
                .delete('/picture/5bcde7e0fb6fc060274aecfe')
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message',
                        'Picture Successfully DELETED! The size of Japanese illustration now is 122');
                    done();
                });
        });
        after(function  (done) {
            chai.request(server)
                .get('/collection')
                .end(function(err, res) {
                    let result = _.map(res.body, (board) => {
                        return { name: board.name, size: board.size };
                    }  );
                    expect(result).to.include( { name: 'Japanese illustration', size: 122  } );
                });
            chai.request(server)
                .get('/picture')
                .end(function(err, res) {
                    let result = _.map(res.body, (pic) => {
                        return { name: pic.name };
                    }  );
                    expect(result).to.not.include( { name: 'character' } );
                    Collection.collection.drop();
                    Picture.collection.drop();
                    User.collection.drop();
                    done();
                });
        });
    })
})
