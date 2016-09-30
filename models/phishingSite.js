
/**********
 * Phishing Site Model
 **********/
var extend      = require('util')._extend,
	pythonShell = require('python-shell'),
	moment      = require('moment'),
	sqliteDB    = require('../dao/sqliteDB'),
	prop        = require('../constant/wifitactical_prop');

var PhishingSite = function(phishingSite) {
	this.attrs = extend(this.defaults, phishingSite);
};

module.exports = PhishingSite;

PhishingSite.prototype.attrs = {};
PhishingSite.prototype.defaults = {
	_id: null,
	name: null,
	site_key: null,
	created_time: null
};

PhishingSite.getAll = function(callback) {
	var conn = sqliteDB.getConnection();
	var sql = 'SELECT ps.* FROM phishing_site ps ';
	console.log(sql);
	conn.all(sql, callback);
	conn.close();
};
// 停用
PhishingSite.stop = function(site_name, callback) {
	if(prop.get('phishingsite.vhost.stop') === 'false') {
		return callback('vitual host did not stop!');
	}
	var full_site_name = prop.get('phishingsite.host.' + site_name);
	var options = {
		mode: 'text',
		scriptPath: prop.get('fakeap.script.path'),
		args: [full_site_name]
	};
	try {
		pythonShell.run(prop.get('phishingsite.script.stop'), options, function(err, results) {
			if(err) {
				return callback(err);
			}
			if(!results || !results.length) {
				return callback(err);
			}
			console.log(JSON.stringify(results));
			callback(err);
		});
	} catch(err) {
		return callback(err);
	}
};

PhishingSite.enablePhishingWeb = function(siteName, callback) {
	var projectName = prop.get('phishingsite.project.' + siteName);
	var options = {
		mode: 'json',
		scriptPath: prop.get('fakeap.script.path'),
		args: ['--name', projectName]
	};
	try {
		pythonShell.run(prop.get('phishingsite.script.enable'), options, function(err, results) {
			if(err) {
				return callback(err);
			}
			console.log('#### enable phishing web results #### ' + moment().format('YYYY-MM-DD HH:mm:ss'));
			console.log(JSON.stringify(results));
			callback(err, results[0]);
		});
	} catch(err) {
		return callback(err);
	}
};

PhishingSite.disablePhishingWeb = function(siteName, callback) {
	var projectName = prop.get('phishingsite.project.' + siteName);
	var options = {
		mode: 'json',
		scriptPath: prop.get('fakeap.script.path'),
		args: ['--name', projectName]
	};
	try {
		pythonShell.run(prop.get('phishingsite.script.disable'), options, function(err, results) {
			if(err) {
				return callback(err);
			}
			console.log('#### disable phishing web results #### ' + moment().format('YYYY-MM-DD HH:mm:ss'));
			console.log(JSON.stringify(results));
			callback(err, results[0]);
		});
	} catch(err) {
		return callback(err);
	}
};

PhishingSite.queryStatus = function(siteName, callback) {
	var projectName = prop.get('phishingsite.project.' + siteName);
	var options = {
		mode: 'json',
		scriptPath: prop.get('fakeap.script.path'),
		args: ['--name', projectName]
	};
	try {
		pythonShell.run(prop.get('phishingsite.script.query'), options, function(err, results) {
			if(err) {
				return callback(err);
			}
			console.log('#### query phishing web results #### ' + moment().format('YYYY-MM-DD HH:mm:ss'));
			console.log(JSON.stringify(results));
			callback(err, results[0]);
		});
	} catch(err) {
		return callback(err);
	}
}