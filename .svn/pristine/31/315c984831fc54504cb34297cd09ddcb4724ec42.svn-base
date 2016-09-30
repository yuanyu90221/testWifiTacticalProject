
/**********
 * Phishing Account Controller
 **********/
var prop = require('../constant/wifitactical_prop');

module.exports = {
	index: function(req, res) {
		res.render('hacker/phishing-accounts', 
			{
				webType: prop.get('web.type'),
				currentFn: 'phishing',
				session: req.session
			}
		);
	}
};