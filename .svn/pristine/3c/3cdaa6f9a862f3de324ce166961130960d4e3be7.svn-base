
/**********
 * Target Management Controller
 **********/
var prop = require('../constant/wifitactical_prop');

module.exports = {
	index: function(req, res) {
		res.render('management/target', 
			{
				webType: prop.get('web.type'),
				currentFn: 'target',
				session: req.session
			}
		);
	}
};