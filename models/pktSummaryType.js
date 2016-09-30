
/**********
 * Packet Summary Type Model
 **********/
var extend = require('util')._extend;
var sqliteDB = require('../dao/sqliteDB');

var PktSummaryType = function(pktSummaryType) {
	this.attrs = extend(this.defaults, pktSummaryType);
};

module.exports = PktSummaryType;

PktSummaryType.prototype.attrs = {};
PktSummaryType.prototype.defaults = {
	_id: null,
	type: null,
	name: null,
	created_time: null
};

PktSummaryType.getAll = function(callback) {
	var conn = sqliteDB.getConnection();
	var sql = 'SELECT pst.* FROM pkt_summary_type pst ';
	console.log(sql);
	conn.all(sql, callback);
	conn.close();
};