
/**********
 * Packet Target Model
 **********/
var extend   = require('util')._extend,
	slide    = require("slide"),
	sqliteDB = require('../dao/sqliteDB');

var PktTarget = function(pktTarget) {
	this.attrs = extend(this.defaults, pktTarget);
};

module.exports = PktTarget;

PktTarget.prototype.attrs = {};
PktTarget.prototype.defaults = {
	_id: null,
	ipv4: null,
	created_time: null
};

PktTarget.insertMultiData = function(data, callback) {
	console.log(data);
	var conn = sqliteDB.getConnection();
	var sql_arr = new Array();
	var _sql;
	for(var i in data) {
		if((i % 500) == 0) {
			_sql = 'INSERT INTO pkt_target(ipv4, created_time) ';
		}
		var str = '';
		if((i % 500) == 0) {
			str = 'SELECT \'' + data[i] + '\' AS ipv4, ' + new Date().getTime() + ' AS created_time ';
		} else {
			str = 'UNION SELECT \'' + data[i] + '\' , ' + new Date().getTime() + ' ';
		}
		_sql += str;
		if((i % 500) == 499 || i == (data.length - 1)) {
			sql_arr.push(_sql);
		}
	}
	conn.exec('BEGIN;', function(err) {
		console.log('BEGIN >>');
		slide.asyncMap(
			sql_arr,
			function(sql, _callback) {
				console.log(sql);
				conn.exec(sql, _callback);
			},
			function(err) {
				if(err) {
					console.log('<< ROLLBACK');
					conn.exec("ROLLBACK;");
					callback(err);
				} else {
					console.log('<< COMMIT');
					conn.exec("COMMIT;");
					callback(err);
				}
				conn.close();
			}
		);
	});
};