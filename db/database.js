var mysql = require('mysql');
var config = require('../config.js');

var pool = mysql.createPool({
    connectionLimit: config.connectionLimit,
    host: config.host,
    user: config.user,
    password: config.password
});

function executeSql(sql) {
    return new Promise(function(resolve, reject) {
        pool.getConnection(function(error, conn) {
            if (error) return reject(error);
            resolve(conn);
        });
    }).then(function(conn) {
        return new Promise(function(resolve, reject) {
            conn.query(sql, function(error) {
                conn.release();
                if (error) return reject(error);
                resolve(Array.prototype.slice.call(arguments, 1));
            });
        });
    });
}

module.exports = {
    executeSql: executeSql,
    executeTransaction: function(fn) {
        var connection;
        var promise = new Promise(function(resolve, reject) {
            pool.getConnection(function(error, conn) {
                if (error) return reject(error);
                resolve(conn);
            });
        }).then(function(conn) {
            connection = conn;
            return fn(execute);

            function execute(sql) {
                return new Promise(function(resolve, reject) {
                    conn.query(sql, function(error) {
                        if (error) return reject(error);
                        resolve(Array.prototype.slice.call(arguments, 1));
                    });
                });
            }
        }).then(function() {
            connection.commit();
            connection.release();
        }, function() {
            connection.rollback();
            connection.release();
        });

        return promise;
    }
};