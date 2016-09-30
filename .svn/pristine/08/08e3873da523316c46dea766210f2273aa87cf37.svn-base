
/**********
 * FakeAP Model
 **********/
var pythonShell = require('python-shell'),
	moment      = require('moment'),
	exec        = require('child_process').exec,
	prop        = require('../constant/wifitactical_prop');

var FakeAp = function() {};
module.exports = FakeAp;

FakeAp.scanNetworkNodes = function(callback) {
	var options = {
		mode: 'json',
		scriptPath: prop.get('fakeap.script.path')
	};
	try {
		pythonShell.run(prop.get('fakeap.script.scan'), options, function(err, results) {
			if(err) {
				return callback(err, null);
			}
			if(!results || !results.length) {
				return callback(err, null);
			}
			console.log('#### scan results #### ' + moment().format('YYYY-MM-DD HH:mm:ss'));
			console.log(JSON.stringify(results));
			callback(err, results[0]);
		});
	} catch(err) {
		return callback(err, null);
	}
};

FakeAp.attackAp = function(apMac, clientMac, callback) {
	var options = {
		mode: 'json',
		scriptPath: prop.get('fakeap.script.path'),
		args: [clientMac, apMac]
	};
	try {
		pythonShell.run(prop.get('fakeap.script.attack'), options, function(err, results) {
			if(err) {
				return callback(err, null);
			}
			console.log('#### attack results #### ' + moment().format('YYYY-MM-DD HH:mm:ss'));
			console.log(JSON.stringify(results));
			callback(err, results[0]);
		});
	} catch(err) {
		return callback(err, null);
	}
};

FakeAp.unattackAp = function(callback) {
	var options = {
		mode: 'json',
		scriptPath: prop.get('fakeap.script.path')
	};
	try {
		pythonShell.run(prop.get('fakeap.script.unattack'), options, function(err, results) {
			if(err) {
				return callback(err, null);
			}
			console.log('#### unattack results #### ' + moment().format('YYYY-MM-DD HH:mm:ss'));
			console.log(JSON.stringify(results));
			callback(err, results[0]);
		});
	} catch(err) {
		return callback(err, null);
	}
};

FakeAp.queryAttackStatus = function(callback) {
	var options = {
		mode: 'json',
		scriptPath: prop.get('fakeap.script.path')
	};
	try {
		pythonShell.run(prop.get('fakeap.script.queryAttackStatus'), options, function(err, results) {
			if(err) {
				return callback(err, null);
			}
			console.log('#### status results #### ' + moment().format('YYYY-MM-DD HH:mm:ss'));
			console.log(JSON.stringify(results));
			callback(err, results[0]);
		});
	} catch(err) {
		return callback(err, null);
	}
};

FakeAp.disableWebAuth = function(site, callback) {
	exec(prop.get('fakeap.script.path') + '/' + prop.get('fakeap.script.disableWebAuth') + ' --name ' + site, function(error, stdout, stderr) {
		console.log('#### disable web auth result #### ' + moment().format('YYYY-MM-DD HH:mm:ss'));
		if(!!error) {
			console.log('error: ' + error);
			callback('Cannot execute python.');
		} else if(!!stderr) {
			console.log('stderr: ' + stderr);
			callback('Some error is in python.');
		} else {
			console.log('stdout: ' + stdout);
			callback(null);
		}
	});
	/*var options = {
		mode: 'text',
		scriptPath: prop.get('fakeap.script.path'),
	};
	try {
		pythonShell.run(prop.get('fakeap.script.disableWebAuth') + '--name ' + site, options, function(err, results) {
			if(err) {
				return callback(err);
			}
			console.log('#### disable web auth result #### ' + moment().format('YYYY-MM-DD HH:mm:ss'));
			console.log(results);
			callback(err);
		});
	} catch(err) {
		return callback(err);
	}*/
};