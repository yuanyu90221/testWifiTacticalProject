
/**********
 * Packet Summary API
 **********/
var PktSummaryType = require('../models/pktSummaryType');
var PktSummaryData = require('../models/pktSummaryData');

module.exports = {
	getPktSummaryTypes: function(req, res) {
		PktSummaryType.getAll(function(err, types) {
			if(err) {
				console.log(err);
				return res.status(404).send();
			}
			return res.status(200).json(types);
		});
	},

	getPktSummaryData: function(req, res) {
		PktSummaryData.getMapAll(function(err, data) {
			if(err) {
				console.log(err);
				return res.status(404).send();
			}
			return res.status(200).json(data);
		});

	},

	getPktSummaryDataByIpv4: function(req, res) {
		var ipv4 = req.query.ipv4;
		PktSummaryData.getByIpv4(ipv4, function(err, data) {
			if(err) {
				console.log(err);
				return res.status(404).send();
			}
			return res.status(200).json(data);
		});
	},

	deletePktSummaryData: function(req, res) {
		PktSummaryData.deleteAll(function(err) {
			if(err) {
				console.log(err);
				return res.status(404).send();
			}
			return res.status(204).send();
		});
	}
};