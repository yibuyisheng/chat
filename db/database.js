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

function * executeSql(sql) {
    try {
        var conn = throwError(yield pool.getConnection.bind(pool))[0];
        return throwError(yield conn.query.bind(conn, sql));
    } catch (e) {
        throw e;
    } finally {
        conn && conn.release();
    }
}

module.exports = {
    executeSql: function(sql, callback) {
        executeGeneratorFn(executeSql.bind(null, sql), callback);
    }
};