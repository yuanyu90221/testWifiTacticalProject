
/**********
 * Fake AP API
 **********/
var FakeAp = require('../models/fakeAp');

var attackApMem = {
	isAttacking: 0,
	username: null,
	user: null,
	target_ap: null,
	target_client: null
};

var resetAttackApMem = function() {
	attackApMem.isAttacking = 0;
	attackApMem.username = null;
	attackApMem.user = null;
	attackApMem.target_ap = null;
	attackApMem.target_client = null;
}

module.exports = {
	getNetworkNodes: function(req, res) {
		var i18n = req.i18n;
		FakeAp.queryAttackStatus(function(err, data) {
			if(err) {
				console.log('Connot query status.');
				console.log(err);
				//return res.status(404).send();
				FakeAp.unattackAp(function(err, data) {
					if(err) {
						console.log(err);
					}
					// 強制清空mem
					resetAttackApMem();
				});
			}
			if(!!data && !!data.success && data.attackStatus.tasks.length) {
				attackApMem.isAttacking = 1;
				attackApMem.target_ap = data.attackStatus.targetBssid;
				attackApMem.target_client = data.attackStatus.targetStation;
				var errMsg = i18n.t('server_msg.error_fakeap_attacking_now', {ap: attackApMem.target_ap, client: attackApMem.target_client});
				return res.status(400).json({errMsg: errMsg});
			} else {
				resetAttackApMem();
				FakeAp.scanNetworkNodes(function(err, data) {
					if(err) {
						console.log('Connot scan network nodes.');
						console.log(err);
						return res.status(404).send();
					}
					var result = {};
					if(!data) {
						return res.status(200).json(result);
					}
					var newApMap = {};
					var apMap = data.apDict;
					var clientMap = data.clientDict;
					for(var apkey in apMap) {
						var apObj = apMap[apkey];
						var connectedClient = new Array();
						for(var clientKey in clientMap) {
							var clientObj = clientMap[clientKey];
							if(apkey == clientObj.bssid) {
								connectedClient.push(clientKey);
							}
						}
						apObj.connectedClient = connectedClient;
						newApMap[apkey] = apObj;
					}
					result.apMap = newApMap;
					result.clientMap = clientMap;
					res.status(200).json(result);
				});
			}
		});
	},

	startToAttackAP: function(req, res) {
		var i18n = req.i18n;
		var ap = req.query.ap;
		var client = req.query.client;
		if(attackApMem.isAttacking) {
			var errMsg = '';
			if(attackApMem.username == req.session.user.username) {
				errMsg = i18n.t('server_msg.error_fakeap_u_attacking_now', {ap: attackApMem.target_ap, client: attackApMem.target_client});
			} else {
				if(!!attackApMem.user && !! attackApMem.target_ap && !!attackApMem.target_client) {
					errMsg = i18n.t('server_msg.error_fakeap_attacking_now', {ap: attackApMem.target_ap, client: attackApMem.target_client});
				} else {
					errMsg = i18n.t('server_msg.error_fakeap_attack_running');
				}
			}
			return res.status(400).json({errMsg: errMsg});
		}
		FakeAp.attackAp(ap, client, function(err, data) {
			if(err) {
				console.log(err);
				if(err.exitCode == 1) {
					var errMsg = '';
					if(attackApMem.username == req.session.user.username) {
						errMsg = i18n.t('server_msg.error_fakeap_u_attacking_now', {ap: attackApMem.target_ap, client: attackApMem.target_client});
					} else {
						if(!!attackApMem.user && !! attackApMem.target_ap && !!attackApMem.target_client) {
							errMsg = attackApMem.user + i18n.t('server_msg.error_fakeap_attacking_now', {ap: attackApMem.target_ap, client: attackApMem.target_client});
						} else {
							errMsg = i18n.t('server_msg.error_fakeap_attack_running');
						}
					}
					return res.status(400).json({errMsg: errMsg});
				}
				return res.status(404).send();
			}
			attackApMem.isAttacking = 1;
			attackApMem.username = req.session.user.username;
			attackApMem.user = req.session.user.name;
			attackApMem.target_ap = ap;
			attackApMem.target_client = client;
			res.status(200).json(data);
		});
	},

	stopAttackingAp: function(req, res) {
		var i18n = req.i18n;
		FakeAp.unattackAp(function(err, data) {
			if(err) {
				console.log(err);
				if(err.exitCode == 1) {
					return res.status(400).json({errMsg: i18n.t('server_msg.error_fakeap_not_attacking')});
				}
				return res.status(404).send();
			}
			resetAttackApMem();
			res.status(200).json(data);
		});
	},

	checkAttackStatus: function(req, res) {
		FakeAp.queryAttackStatus(function(err, data) {
			if(err) {
				console.log(err);
				return res.status(404).send();
			}
			res.status(200).json(data);
		});
	},

	checkAttacking: function(req, res) {
		/*if(attackApMem.username != req.session.user.username) {
			return res.status(204).send();
		}*/
		FakeAp.queryAttackStatus(function(err, data) {
			if(err) {
				console.log(err);
				return res.status(204).send();
			}
			if(!data.success && !data.attackStatus.tasks.length) {
				resetAttackApMem();
				return res.status(204).send();
			} else {
				var result = {
					ap: data.attackStatus.targetBsInfo,
					client: {
						station: data.attackStatus.targetStation,
						bssid: data.attackStatus.targetBssid
					}
				};
				console.log('attackApMem.username: ' + attackApMem.username);
				console.log('req.session.user.username: ' + req.session.user.username);
				if(attackApMem.username != req.session.user.username) {
					result.isSelf = false;
					result.user = attackApMem.user;
				} else {
					result.isSelf = true;
				}
				res.status(200).json(result);
			}
		});
	},

	disableWebAuth: function(req, res) {
		var site = req.query.site;
		console.log('site = ' + site);
		FakeAp.disableWebAuth(site, function(err) {
			console.log(err);
		});
		res.status(204).send();
	}
};