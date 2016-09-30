
/**********
 * Phishing Site Controller
 **********/
var prop = require('../constant/wifitactical_prop');

module.exports = {
	index: function(req, res) {
		res.render('hacker/phishing-site', 
			{
				webType: prop.get('web.type'),
				currentFn: 'phishingSite',
				session: req.session
			}
		);
	}
};