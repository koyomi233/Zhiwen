let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../bin/www');
let expect = chai.expect;

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
                    done();
                });
        });
    })
})
