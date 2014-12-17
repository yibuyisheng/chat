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

    it.only('generator', function(done) {
        function * g1 () {
            yield 1;
            yield 2;
            yield 3;
        }

        /**
         * g2 相当于：
         * function * g2 () {
         *     yield 1;
         *     yield 2;
         *     yield 3;
         * }
         */
        function * g2 () {
            yield * g1();
        }

        /**
         * g3()返回一个iterator，当调用iterator.next()的时候，value中的值是g1()返回的iterator
         */
        function * g3 () {
            yield g1();
            yield 6;
        }

        /**
         * g4 相当于：
         * function * g4 () {
         *     yield 1;
         *     yield 2;
         *     yield 3;
         *     yield 4;
         * }
         */
        function * g4 () {
            yield * g1();
            yield 4;
        }

        /**
         * g5 相当于：
         * function * g5 () {
         *     yield 5;
         *     yield 1;
         *     yield 2;
         *     yield 3;
         * }
         */
        function * g5 () {
            yield 5;
            yield * g1();
        }

        var toString = Object.prototype.toString;

        var iterator = g1();
        assert.equal(1, iterator.next().value);
        assert.equal(2, iterator.next().value);
        assert.equal(3, iterator.next().value);

        iterator = g2();
        assert.equal(1, iterator.next().value);
        assert.equal(2, iterator.next().value);
        assert.equal(3, iterator.next().value);

        iterator = g3();
        var g1Iterator = iterator.next().value;
        assert.equal('[object Generator]', toString.call(g1Iterator));
        assert.equal(1, g1Iterator.next().value);
        assert.equal(2, g1Iterator.next().value);
        assert.equal(3, g1Iterator.next().value);
        assert.equal(6, iterator.next().value);

        iterator = g4();
        assert.equal(1, iterator.next().value);
        assert.equal(2, iterator.next().value);
        assert.equal(3, iterator.next().value);
        assert.equal(4, iterator.next().value);

        iterator = g5();
        assert.equal(5, iterator.next().value);
        assert.equal(1, iterator.next().value);
        assert.equal(2, iterator.next().value);
        assert.equal(3, iterator.next().value);

        done();
    });
});
