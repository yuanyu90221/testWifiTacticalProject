var extend   = require('util')._extend,
	moment   = require('moment'),
	sqliteDB = require('../dao/sqliteDB');

var SigninLog = function(_log) {
	this.attrs = extend(this.defaults, _log);
};

SigninLog.prototype = {
	attrs: {},
	defaults: {
		_id: null,
		email: null,
		password: null,
		ip: null,
		signin_time: null
	},
	get: function(key) {
		return this.attrs[key];
	},
	set: function(key, value) {
		this.attrs[key] = value;
	},
	create: function(callback) {
		console.log('=== signinLog.create - ' + moment().format('YYYY-MM-DD HH:mm:ss') + ' ===');
		var conn = sqliteDB.getConnection();
		var sql = 'INSERT INTO log_fap_signin(email, password, ip, signin_time) ' +
				'VALUES($email, $password, $ip, $signin_time) ';
		var params = {
			$email:       this.attrs.email,
			$password:    this.attrs.password,
			$ip:          this.attrs.ip,
			$signin_time: this.attrs.signin_time
		};
		console.log(sql);
		console.log(params);
		conn.run(sql, params, function(err) {
			conn.close();
			return callback(err);
		});
	}
};

SigninLog.findLastByIp = function(ip, callback) {
	console.log('=== signinLog.findLastByIp - ' + moment().format('YYYY-MM-DD HH:mm:ss') + ' ===');
	var conn = sqliteDB.getConnection();
	var sql = 'SELECT l.* FROM log_fap_signin l WHERE l.ip = $ip order by signin_time desc limit 1';
	var params = {$ip: ip};
	console.log(sql);
	console.log(params);
	conn.get(sql, params, function(err, signinLog) {
		conn.close();
		return callback(err, signinLog);
	});
};

module.exports = SigninLog;