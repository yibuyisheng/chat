var executeGeneratorFn = require('nodejs-lib').executeGeneratorFn;

var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 10,
    host: '127.0.0.1',
    user: 'root',
    password: 'root'
});


function throwError(result) {
    if (result && result[0]) throw result[0];
    return result && result.length >= 2 ? Array.prototype.slice.call(result, 1) : null;
}

function * findList(sql) {
    try {
        var conn = throwError(yield pool.getConnection.bind(null))[0];
        var rows = throwError(yield conn.query.bind(null, sql))[0];
        return rows;
    } catch (e) {
        throw e;
    } finally {
        conn && conn.release();
    }
}

function * update(sql) {
    try {
        var conn = throwError(yield pool.getConnection.bind(null))[0];
        var result = throwError(yield conn.query.bind(null, sql))[0];
        return result;
    } catch (e) {
        throw e;
    } finally {
        conn && conn.release();
    }
}

module.exports = {
    findList: function(sql, callback) {
        executeGeneratorFn(findList.bind(null, sql), callback);
    },
    update: function(sql, callback) {
        executeGeneratorFn(update.bind(null, sql), callback);
    }
};