
/**********
 * FreeAP Model
 **********/
var pythonShell = require('python-shell'),
	moment      = require('moment'),
	exec        = require('child_process').exec,
	prop        = require('../constant/wifitactical_prop'),
	SigninLog   = require('../models/signinLog');

var FreeAp = function() {};
module.exports = FreeAp;

FreeAp.queryFreeApStatus = function(callback) {
	console.log('=== freeAp.queryFreeApStatus - ' + moment().format('YYYY-MM-DD HH:mm:ss') + ' ===');
	var options = {
		mode: 'json',
		scriptPath: prop.get('fakeap.script.path')
	};
	try {
		console.log('Call queryFreeAPStatus.py');
		pythonShell.run(prop.get('freeap.script.queryFreeAPStatus'), options, function(err, results) {
			if(err) {
				return callback(err);
			}
			console.log(JSON.stringify(results));
			return callback(err, results[0]);
		});
	} catch(err) {
		return callback(err);
	}
}

FreeAp.startFreeAp = function(callback) {
	console.log('=== freeAp.startFreeAp - Call startFreeAP.py - ' + moment().format('YYYY-MM-DD HH:mm:ss') + ' ===');
	var options = {
		mode: 'json',
		scriptPath: prop.get('fakeap.script.path'),
		args: ['--WebAuthNam', 'Fake_WiFi_AP']
	};
	try {
		console.log('Call startFreeAP.py');
		pythonShell.run(prop.get('freeap.script.startFreeAP'), options, function(err, results) {
			if(err) {
				return callback(err);
			}
			console.log(JSON.stringify(results));
			return callback(err, results[0]);
		});
	} catch(err) {
		return callback(err);
	}
};

FreeAp.stopFreeAp = function(callback) {
	console.log('=== freeAp.stopFreeAp - ' + moment().format('YYYY-MM-DD HH:mm:ss') + ' ===');
	var options = {
		mode: 'json',
		scriptPath: prop.get('fakeap.script.path')
	};
	try {
		console.log('Call stopFreeAP.py');
		pythonShell.run(prop.get('freeap.script.stopFreeAP'), options, function(err, results) {
			if(err) {
				return callback(err);
			}
			console.log(JSON.stringify(results));
			return callback(err, results[0]);
		});
	} catch(err) {
		return callback(err);
	}
};

FreeAp.listCennectedClient = function(callback) {
	console.log('=== freeAp.listCennectedClient - ' + moment().format('YYYY-MM-DD HH:mm:ss') + ' ===');
	var options = {
		mode: 'json',
		scriptPath: prop.get('fakeap.script.path')
	};
	try {
		console.log('Call listAssociatedStation.py');
		pythonShell.run(prop.get('freeap.script.listConnected'), options, function(err, results) {
			if(err) {
				return callback(err);
			}
			console.log(JSON.stringify(results));
			return callback(err, results[0]);
		});
	} catch(err) {
		return callback(err);
	}
};