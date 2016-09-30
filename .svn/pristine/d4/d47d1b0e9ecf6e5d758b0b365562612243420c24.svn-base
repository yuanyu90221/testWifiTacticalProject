
/**********
 * Packet Summary Data Model
 **********/
var extend   = require('util')._extend,
	slide    = require("slide"),
	sqliteDB = require('../dao/sqliteDB');

var PktSummaryData = function(pktSummaryData) {
	this.attrs = extend(this.defaults, pktSummaryData);
};

module.exports = PktSummaryData;

PktSummaryData.prototype.attrs = {};
PktSummaryData.prototype.defaults = {
	_id: null,
	ipv4: null,
	type: null,
	data: null,
	created_time: null
};

PktSummaryData.getMapAll = function(callback) {
	var conn = sqliteDB.getConnection();
	var sql = 'SELECT * FROM pkt_summary_data';
	console.log(sql);
	conn.all(sql, function(err, rows) {
		if(err) {
			conn.close();
			return callback(err, null);
		}
		var result = organizeRowData(rows);
		/*for(var i in rows) {
			var row = rows[i];
			if(!result[row.ipv4]) {
				result[row.ipv4] = {};
			}

			var tar = result[row.ipv4];
			if(!tar[row.type]) {
				tar[row.type] = new Array();
			}
			var arr = tar[row.type];
			arr.push(row.data);
		}*/
		callback(err, result);
	});
	conn.close();
};

PktSummaryData.getByIpv4 = function(ipv4, callback) {
	var conn = sqliteDB.getConnection();
	var sql = 'SELECT * FROM pkt_summary_data ' +
			'WHERE ipv4 = $ipv4 ';
	var params = {
		$ipv4: ipv4
	};
	console.log(sql);
	console.log(params);
	conn.all(sql, params, function(err, rows) {
		if(err) {
			conn.close();
			return callback(err, null);
		}
		var result = organizeRowData(rows);
		/*for(var i in rows) {
			var row = rows[i];
			if(!result[row.ipv4]) {
				result[row.ipv4] = {};
			}

			var tar = result[row.ipv4];
			if(!tar[row.type]) {
				tar[row.type] = new Array();
			}
			var arr = tar[row.type];
			arr.push(row.data);
		}*/
		callback(err, result);
	});
	conn.close();
};

PktSummaryData.deleteAll = function(callback) {
	var conn = sqliteDB.getConnection();
	conn.serialize(function() {
		var sql = 'DELETE FROM pkt_summary_data ';
		console.log(sql);
		conn.run(sql, function(err) {
			conn.close();
			return callback(err);
		});
	});
};

PktSummaryData.insertMultiData = function(data, callback) {
	var conn = sqliteDB.getConnection();
	var sql_arr = new Array();
	var _sql;
	for(var i in data) {
		if((i % 500) == 0) {
			_sql = 'INSERT INTO pkt_summary_data(ipv4, mac, type, data, timestamp, created_time) ';
		}
		var str = '';
		if((i % 500) == 0) {
			str = 'SELECT "' + data[i].ipv4 + '" AS ipv4, "'
							 + data[i].mac  + '" AS mac, "'
							 + data[i].type + '" AS type, "'
							 + data[i].data + '" as data, '
							 + data[i].timestamp + ' AS timestamp, '
							 + new Date().getTime() + ' AS created_time ';
		} else {
			str = 'UNION SELECT "' + data[i].ipv4 + '", "'
								   + data[i].mac + '", "'
								   + data[i].type + '", "'
								   + data[i].data + '", '
								   + data[i].timestamp + ', '
								   + new Date().getTime() + ' ';
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

function organizeRowData(rows) {
	var result = {};
	for(var i in rows) {
		var row = rows[i];
		if(!result[row.ipv4]) {
			result[row.ipv4] = {};
		}

		var tar = result[row.ipv4];
		if(!tar[row.type]) {
			tar[row.type] = new Array();
		}
		var arr = tar[row.type];
		arr.push({
			mac: row.mac,
			timestamp: row.timestamp,
			data: row.data
		});
	}
	return result;
}