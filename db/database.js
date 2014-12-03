var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 10,
    host: '127.0.0.1',
    user: 'root',
    password: 'root'
});

module.exports = {
    executeSql: function(sql) {
        return new Promise(function(resolve, reject) {
            pool.getConnection(function(error, conn) {
                if (error) return reject(error);
                resolve(conn);
            });
        }).then(function(conn) {
            return new Promise(function(resolve, reject) {
                conn.query(sql, function(error) {
                    if (error) return reject(error);
                    resolve(Array.prototype.slice.call(arguments, 1));
                });
            });
        });
    }
};