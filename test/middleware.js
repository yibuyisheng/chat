var createMiddleware = require('../common/middleware.js');
var assert = require('assert');

describe('#middleware', function() {
    it('middleware', function(done) {
        createMiddleware().use(function * (next) {
            assert.equal(1, this.prop);
            this.prop = 2;
            yield next;
        }).use(function * (next) {
            assert.equal(2, this.prop);
            yield next;
        }).use(function * () {
            throw new Error('error test');
        }).go({prop: 1}).catch(function(error) {
            try {
                assert.equal('error test', error.message);
                done();
            } catch (e) {
                done(e);
            }
        });
    });
});
