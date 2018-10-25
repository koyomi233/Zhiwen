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

describe('User', () => {
    describe('GET /user', () => {
        it('should return all the users in an array', function (done) {
            chai.request(server)
                .get('/user')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(3);
                    let result = _.map(res.body, (account) => {
                        return { name: account.name }
                    });
                    expect(result).to.include( { name: 'soundtrack' } );
                    expect(result).to.include( { name: 'koyomi' } );
                    expect(result).to.include( { name: 'Shinobu' } );

                    User.collection.drop();
                    Collection.collection.drop();
                    Picture.collection.drop();
                    done();
                });
        });
    });
    describe('GET /user/:email', () => {
        it('should return a user which matched the email', function (done) {
            chai.request(server)
                .get('/user/317657452@qq.com')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(1);
                    let result = _.map(res.body, (account) => {
                        return { name: account.name,
                            email: account.email}
                    });
                    expect(result).to.include( { name: 'soundtrack', email: '317657452@qq.com'  } );
                    done();
                });
        });
        it('should return a message for invalid user email', function (done) {
            chai.request(server)
                .get('/user/000000000')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message', 'User NOT Found!' );
                    Collection.collection.drop();
                    Picture.collection.drop();
                    User.collection.drop();
                    done();
                });
        });
    });
    describe('GET /user/names/:name', () => {
        it('should return a message for invalid user name', function (done) {
            chai.request(server)
                .get('/user/names/Marvel')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message', 'User NOT Found!' );
                    done();
                });
        });
        it('should return a user which matched the name', function (done) {
            chai.request(server)
                .get('/user/names/soundtrack')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(1);
                    let result = _.map(res.body, (account) => {
                        return { name: account.name,
                            email: account.email}
                    });
                    expect(result).to.include( { name: 'soundtrack', email: '317657452@qq.com'  } );
                    Collection.collection.drop();
                    Picture.collection.drop();
                    User.collection.drop();
                    done();
                });
        });
    });
    describe('POST /user', () => {
        it('should return a message and update users', function (done) {
            let user = {
                name: 'zack' ,
                password: 'jkjflsf9789789',
                email: 'zack12345@qq.com',
                collectionid: [],
                fans: [],
                follows: []
            };
            chai.request(server)
                .post('/user')
                .send(user)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message')
                        .equal('User Successfully Added!' );
                    done();
                });
        });
        after(function(done){
            chai.request(server)
                .get('/user')
                .end(function(err, res) {
                    let result = _.map(res.body, (account) => {
                        return { name: account.name,
                            email: account.email}
                    });
                    expect(result).to.include( { name: 'zack', email: 'zack12345@qq.com' } );
                    Collection.collection.drop();
                    Picture.collection.drop();
                    User.collection.drop();
                    done();
                });
        });
    });
    describe('PUT /user/:id/removeFollow', () => {
        it('should return a message and update users', function (done) {
            chai.request(server)
                .put('/user/5bcde933fb6fc060274aee1a/removeFollow')
                .send({'follows': '5bcde909fb6fc060274aedf5'})
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message')
                        .equal('You have removed the follow on this user!' );
                    done();
                });
        });
        after(function  (done) {
            chai.request(server)
                .get('/user/317657452@qq.com')
                .end(function(err, res) {
                    let result = _.map(res.body, (account) => {
                        return { fans: account.fans };
                    }  );
                    expect(result).to.include( { fans: [] } );
                });
            chai.request(server)
                .get('/user/317657452h@sina.com')
                .end(function(err, res) {
                    let result = _.map(res.body, (account) => {
                        return { follows: account.follows };
                    }  );
                    expect(result).to.include( { follows: [] } );
                    Collection.collection.drop();
                    Picture.collection.drop();
                    User.collection.drop();
                    done();
                });
        });
    })
})