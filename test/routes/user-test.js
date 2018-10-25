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
                        return { name: account.name,
                            email: account.email}
                    });
                    expect(result).to.include( { name: 'soundtrack', email: '317657452@qq.com'  } );
                    expect(result).to.include( { name: 'koyomi', email: '317657452h@sina.com'  } );
                    expect(result).to.include( { name: 'Shinobu', email: '317657452h@126.com'  } );
                    Collection.collection.drop();
                    Picture.collection.drop();
                    User.collection.drop();
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
})