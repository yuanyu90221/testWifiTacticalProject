
/**********
 * Role Model
 **********/
var extend = require('util')._extend;
var sqliteDB = require('../dao/sqliteDB');

var Role = function(role) {
	this.attrs = extend(this.defaults, role);
};

module.exports = Role;

Role.prototype.attrs = {};
Role.prototype.defaults = {
	_id: null,
	role_key: null,
	name: null,
	created_time: null
};

Role.getByRoleKey = function(roleKey, callback) {
	var conn = sqliteDB.getConnection();
	var sql = 'SELECT * FROM role WHERE role_key = $roleKey ';
	var params = {$roleKey: roleKey};
	console.log(sql);
	console.log(params);
	conn.get(sql, params, callback);
	conn.close();
};

Role.getAll = function(callback) {
	var conn = sqliteDB.getConnection();
	var sql = 'SELECT r.* FROM role r ';
	console.log(sql);
	conn.all(sql, callback);
	conn.close();
};