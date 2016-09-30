
/**********
 * Target API
 **********/
var Target = require('../models/target');

module.exports = {
	getAll: function(req, res) {
		Target.getAll(function(err, targets) {
			if(err) {
				console.log(err);
				return res.status(404).send();
			}
			return res.status(200).json(targets);
		});
	},

	getTargetApps: function(req, res) {
		var id = req.params.id;
		Target.getTargetApps(id, function(err, apps) {
			if(err) {
				console.log(err);
				return res.status(404).send();
			}
			return res.status(200).json(apps);
		});
	}
};