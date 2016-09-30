
/**********
 * Account Management Controller
 **********/
var prop = require('../constant/wifitactical_prop');

module.exports = {
	index: function(req, res) {
		res.render('management/account', 
			{
				webType: prop.get('web.type'),
				currentFn: 'account',
				session: req.session
			}
		);
	}
};