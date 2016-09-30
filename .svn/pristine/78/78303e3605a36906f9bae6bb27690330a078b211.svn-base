
/**********
 * Fake AP Controller
 **********/
var prop = require('../constant/wifitactical_prop');

module.exports = {
	index: function(req, res) {
		res.render('hacker/fake-ap', 
			{
				webType: prop.get('web.type'),
				currentFn: 'fake-ap',
				session: req.session
			}
		);
	}
};