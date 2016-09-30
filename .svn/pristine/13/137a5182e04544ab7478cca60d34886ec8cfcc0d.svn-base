
/**********
 * Free AP API
 **********/
var moment    = require('moment'),
	async     = require('async'),
	FreeAp    = require('../models/freeAp'),
	SigninLog = require('../models/signinLog');

 module.exports = {
 	queryStatus: function(req, res) {
		console.log('===== freeApApi queryStatus - ' + moment().format('YYYY-MM-DD HH:mm:ss') + ' =====');
		FreeAp.queryFreeApStatus(function(err, result) {
 			if(err) {
				console.log(err);
				return res.status(404).send();
 			}
 			if(result.success == 1) {
 				return res.status(200).json(result.status);
 			} else {
 				console.log(result.errmsg);
				return res.status(404).send();
 			}
		});

 	},

 	startupFreeAp: function(req, res) {
		console.log('===== freeApApi startupFreeAp - ' + moment().format('YYYY-MM-DD HH:mm:ss') + ' =====');
 		var i18n = req.i18n;

 		FreeAp.startFreeAp(function(err, result) {
 			if(err) {
				console.log(err);
				return res.status(404).json({errMsg: err});
 			}
 			if(result.success == 1) {
 				return res.status(204).send();
 			} else {
 				console.log(result.errmsg);
				return res.status(404).send();
 			}
 		});
 	},

 	shutdownFreeAp: function(req, res) {
		console.log('===== freeApApi shutdownFreeAp - ' + moment().format('YYYY-MM-DD HH:mm:ss') + ' =====');
 		var i18n = req.i18n;

 		FreeAp.stopFreeAp(function(err, result) {
 			if(err) {
				console.log(err);
				return res.status(404).json({errMsg: err});
 			}
 			if(result.success == 1) {
 				return res.status(204).send();
 			} else {
 				console.log(result.errmsg);
				return res.status(404).send();
 			}
 		});
 	},

 	getConnectedClient: function(req, res) {
		console.log('===== freeApApi getConnectedClient - ' + moment().format('YYYY-MM-DD HH:mm:ss') + ' =====');
 		var i18n = req.i18n;
 		FreeAp.listCennectedClient(function(err, result) {
 			if(err) {
				console.log(err);
				return res.status(404).send();
 			}
			if(result.success == 1) {
				var pyResultList = result.stationDict,
					arr = new Array();
				for(var key in pyResultList) 
					arr.push(pyResultList[key]);
				async.eachSeries(
					arr,
					function(item, callback) {
						if(typeof item.ipAddr !== 'undefined' && item.ipAddr.length > 0) {
							SigninLog.findLastByIp(item.ipAddr, function(err, result) {
								if(typeof result !== 'undefined') {
									item.email = result.email;
									item.password = result.password;
									item.signin_time = result.signin_time;
								} else {
									item.email = '';
									item.password = '';
									item.signin_time = '';
								}
								callback(err, item);
							});
						} else {
							item.email = '';
							item.password = '';
							item.signin_time = '';
							callback(err, item);
						}
					},
					function(err) {
						if(err) {
							console.log(err);
							return res.status(404).send();
						}
						return res.status(200).json(arr);
					}
				);
			} else {
 				console.log(result.errmsg);
				return res.status(404).send();
			}
 		});
 	},

 	logClientSigninInfo: function(req, res) {
		console.log('===== freeApApi logClientSigninInfo - ' + moment().format('YYYY-MM-DD HH:mm:ss') + ' =====');
 		var data = {
 			email: req.body.email,
 			password: req.body.passwd,
 			ip: req.body.ip,
 			signin_time: req.body.signin_time
 		};
 		var signinLog = new SigninLog(data);
 		signinLog.create(function(err) {
 			if(err) {
				console.log(err);
				return res.status(404).send();
			}
 			return res.status(204).send();
 		});
 	}
 };