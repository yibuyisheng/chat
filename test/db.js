var db = require('../db/database.js');
var assert = require('assert');

describe('#database', function() {

    beforeEach(function(done) {
        db.executeSql("CREATE TABLE IF NOT EXISTS `chat`.`test` (`id` INT(11) NOT NULL AUTO_INCREMENT,`name` VARCHAR(45) NULL, PRIMARY KEY (`id`));", done);
    });
    afterEach(function(done) {
        db.executeSql("drop table `chat`.`test`", done);
    });

    it('insert data', function(done) {
        db.executeSql("insert into chat.test(name) values('张三'),('李四')", function(error, result) {
            if (error) return done(error);
            assert.equal(2, result[0].affectedRows);
            done();
        });
    });

    it('select data', function(done) {
        db.executeSql("insert into chat.test(name) values('张三'),('李四')", function(error, result) {
            if (error) return done(error);
            db.executeSql("select * from chat.test", function(error, result) {
                if (error) return done(error);
                assert.equal(2, result[0].length);
                done();
            });
        });
    });

});
