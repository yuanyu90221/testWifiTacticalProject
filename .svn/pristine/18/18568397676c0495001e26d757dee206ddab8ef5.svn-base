
/**********
 * Target Model
 **********/
var extend = require('util')._extend;
var mssql = require('mssql');
var databaseProp = require('../constant/database_prop');

var dataSource = {
	user: databaseProp.get('database.mssql.username'),
	password: databaseProp.get('database.mssql.password'),
	server: databaseProp.get('database.mssql.url'),
	database: databaseProp.get('database.mssql.database'),
	options: {
		encrypt: false
	}
};

var Target = function(target) {
	this.attrs = extend(this.defaults, target);
};

module.exports = Target;

Target.prototype.attrs = {};
Target.prototype.defaults = {
	_id: null,
	phone: null,
	created_time: null
};
Target.prototype.isValid = function() {
	if(typeof this.attrs.phone === 'undefined' || this.attrs.phone == null || this.attrs.phone.length == 0) {
		return '電話不可以空白！';
	}
	return null;
};
Target.prototype.get = function(key) {
	return this.attrs[key];
};
Target.prototype.set = function(key, value) {
	this.attrs[key] = value;
};

Target.getAll = function(callback) {
	var conn = new mssql.Connection(dataSource);
	conn.connect(function(err) {
		if(err) {
			callback(err, null);
		} else {
			var sql = 'SELECT t.* FROM target t ';
			var request = new mssql.Request(conn);
			console.log('[sql] ' + sql);
			request.query(sql, function(err, recordsets) {
				callback(err, recordsets);
			});
		}
		conn.close();
	});
};

Target.getTargetApps = function(targetId, callback) {
	var conn = new mssql.Connection(dataSource);
	conn.connect(function(err) {
		if(err) {
			callback(err, null);
		} else {
			var sql = 'SELECT ta.* FROM target_app ta ' +
					'WHERE ta.target_id = @id ';
			var request = new mssql.Request(conn);
			request.input('id', mssql.Int, targetId);
			console.log('[sql] ' + sql);
			console.log('@id= ' + targetId);
			request.query(sql, function(err, recordsets) {
				callback(err, recordsets);
			});
		}
		conn.close();
	});
};