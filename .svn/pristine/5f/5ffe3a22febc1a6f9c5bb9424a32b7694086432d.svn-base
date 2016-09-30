
/**********
 * Role API
 **********/
var Role = require('../models/role');

module.exports = {
	getAll: function(req, res) {
		Role.getAll(function(err, roles) {
			if(err) {
				console.log(err);
				return res.status(404).send();
			}
			return res.status(200).json(roles);
		});
	}
};