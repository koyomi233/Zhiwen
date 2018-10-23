let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../bin/www');
let expect = chai.expect;

chai.use(chaiHttp);
chai.use(require('chai-things'));
let _ = require('lodash' );

var datastore = require('../../models/collection');

describe('Collection', () => {
    beforeEach(function(){
        datastore.remove().exec(function(err){
            if (err)
                console.log(err);
        });

        var collection1 = new datastore({
            _id: '5bceef76b42bc703dde7da06',
            category: 'Animation',
            name: 'Japanese illustration',
            size: 123,
            follow: 7
        });
        var collection2 = new datastore({
            _id: '5bceef76b42bc703dde7da07',
            category: 'sketch',
            name: 'Black and White',
            size: 34,
            follow: 0
        });
        var collection3 = new datastore({
            _id: '5bcef1bff16ce3040a5d7dcb',
            category: 'photography',
            name: 'Girls!',
            size: 85,
            follow: 12
        });

        collection1.save();
        collection2.save();
        collection3.save();
    });
    describe('GET /collection', () => {
        it('should return all the collections in an array', function (done) {
            chai.request(server)
                .get('/collection')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body.length).to.equal(3);
                    let result = _.map(res.body, (board) => {
                        return { category: board.category,
                            name: board.name }
                    });
                    expect(result).to.include( { category: 'Animation', name: 'Japanese illustration'  } );
                    expect(result).to.include( { category: 'sketch', name: 'Black and White'  } );
                    expect(result).to.include( { category: 'photography', name: 'Girls!'  } );
                    done();
                });
        });
    });
    describe('GET /collection/names/:name', () => {
        it('should return several collections which matches the name', function (done) {
            chai.request(server)
                .get('/collection/names/illustration')
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    expect(res.body.length).to.equal(1);
                    let  result = _.map(res.body, (board) => {
                        return { category: board.category,
                            name: board.name }
                    });
                    expect(result).to.include( { category: 'Animation', name: 'Japanese illustration'  } );
                    done();
                });
        });
        it('should return a message for invalid collection name ', function (done) {
            chai.request(server)
                .get('/collection/names/Marvel')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message', 'Collection NOT Found!' ) ;
                    done();
                });
        });
    });
    describe('POST /collection', () => {
        it('should return confirmation message and update datastore', function (done) {
            let board = {
                category: 'Travel' ,
                name: 'Beijing',
                size: 14,
                follow: 2
            };
            chai.request(server)
                .post('/collection')
                .send(board)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message').equal('Collection Successfully Added!' );
                    done();
                });
        });
        after(function  (done) {
            chai.request(server)
                .get('/collection')
                .end(function(err, res) {
                    let result = _.map(res.body, (board) => {
                        return { category: board.category,
                            name: board.name };
                    }  );
                    expect(result).to.include( { category: 'Travel', name: 'Beijing'  } );
                    done();
                });
        });
    })
    describe('PUT /collection/:id/attentionAdd', () => {
        it('should return a message and follow + 1', function (done) {
            chai.request(server)
                .put('/collection/5bceef76b42bc703dde7da06/attentionAdd')
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    let board = res.body.data;
                    expect(board).to.include({_id: '5bceef76b42bc703dde7da06', follow: 8});
                    done();
                });
        });
        it('should return a message for invalid collection id', function (done) {
            chai.request(server)
                .put('/collection/00000000000000/attentionAdd')
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message','Collection NOT Found!' ) ;
                    done();
                });
        });
    })
    describe('DELETE /collection/:id', () => {
        it('should return a message for invalid collection id', function (done) {
            chai.request(server)
                .delete('/collection/00000000000000')
                .end(function(err, res) {
                    expect(res.body).to.have.property('message', 'Collection NOT DELETED!');
                    done();
                });
        });
    })
});