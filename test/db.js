var db = require('../db/database.js');
var assert = require('assert');

describe('#database', function() {

    beforeEach(function(done) {
        db.executeSql("CREATE TABLE IF NOT EXISTS `chat`.`test` (`id` INT(11) NOT NULL AUTO_INCREMENT,`name` VARCHAR(45) NULL, PRIMARY KEY (`id`));").then(done.bind(null, null), done);
    });
    afterEach(function(done) {
        db.executeSql("drop table `chat`.`test`").then(done.bind(null, null), done);
    });

    it('insert data', function(done) {
        db.executeSql("insert into chat.test(name) values('张三'),('李四')").then(function(result) {
            assert.equal(2, result[0].affectedRows);
            done();
        }).catch(done);
    });

    it('select data', function(done) {
        db.executeSql("insert into chat.test(name) values('张三'),('李四')").then(function(result) {
            return db.executeSql("select * from chat.test");
        }).then(function(result) {
            assert.equal(2, result[0].length);
            done();
        }).catch(done);
    });

});
