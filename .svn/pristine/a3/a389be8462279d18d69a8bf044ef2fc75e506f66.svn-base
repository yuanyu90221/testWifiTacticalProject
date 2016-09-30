
/**********
 * Authorization Handle
 **********/
var prop = require('../constant/wifitactical_prop');


module.exports = {
	checkNotLogin: function(req, res, next) {
		if(req.session.user) {
			var type = prop.get('web.type');
			
			res.redirect(prop.get('app.index.' + type));
		}
		next();
	},

	checkLogin: function(req, res, next) {
		if(req.session.user) {
			next();
		} else {
			res.redirect('/logout');
		}
	},

	checkRoleAdmin: function(req, res, next) {
		if (req.session.user.role_key != 'ROLE_ADMIN') {
			res.redirect('back');
		}
		next();
	},

	checkLogin4Ajax: function(req, res, next) {
		if(req.session.user) {
			next();
		} else {
			res.status(401).send();
		}
	},

	checkRoleAdmin4Ajax: function(req, res, next) {
		if (req.session.user.role_key != 'ROLE_ADMIN') {
			res.status(403).send();
		}
		next();
	}
};