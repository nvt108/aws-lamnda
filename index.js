'use strict';
let mysql = require('mysql');
let config = require('./config');
let pool = mysql.createPool({
    connectionLimit: 10,
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database
});
exports.handler = async (event, context, callback) => {
    let result = {};
    let errMsg = '';
    try {
        let sql = "SELECT * FROM tbl_test WHERE deleted = ? ";
        await getData(sql, 0).then(res => {
            result = res;
        }, errMesg => {
            errMsg = errMesg;
        });
    } catch (err) {
        throw new Error("Error: " + err);
    }
    console.log(result);
    return callback(null, {body: JSON.stringify(result), statusCode: 200});
};

let getData = (sql, params) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            connection.query(sql, params, (err, results) => {
                if (err) {
                    return reject(err);
                }
                connection.release();
                resolve(results);
            });
        });
    });
};


