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
        it('should return a message for invalid id', function () {
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
    })
})
