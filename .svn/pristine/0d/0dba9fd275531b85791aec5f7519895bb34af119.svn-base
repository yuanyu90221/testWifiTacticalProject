
/**********
 * User API
 **********/
var crypto = require('crypto');
var User = require('../models/user');
var Role = require('../models/role');

module.exports = {
	save: function(req, res) {
		var i18n = req.i18n;
		var d = new Date();
		var user = new User(req.body);
		user.set('created_user', req.session.user.username);
		user.set('created_time', d.getTime());
		user.set('modified_user', req.session.user.username);
		user.set('modified_time', d.getTime());
		var err = user.isValid();
		if(err) {
			return res.status(400).json({errMsg : i18n.t(err)});
		}
		User.getByUsername(user.get('username'), function(err, ouser) {
			if(err) {
				console.log(err);
				return res.status(404).send();
			}
			if(ouser) {
				return res.status(400).json({errMsg : i18n.t('server_msg.error_user_act_exist', {username: ouser.username})});
			}
			user.create(function(err, id) {
				if(err) {
					console.log(err);
					return res.status(404).send();
				}
				console.log('new user id = ' + id);
				User.getById(id, function(err, user) {
					if(err) {
						console.log(err);
						return res.status(404).send();
					}
					return res.status(200).json(user);
				});
			});
		});
	},

	getAll: function(req, res) {
		User.getAll(function(err, users) {
			if(err) {
				console.log(err);
				return res.status(404).send();
			}
			return res.status(200).json(users);
		});
	},

	update: function(req, res) {
		var i18n = req.i18n;
		var md5 = crypto.createHash('md5')
		var id = req.params.id;
		var editUser = req.body;
		var d = new Date();
		User.getById(id, function(err, user) {
			if(err) {
				console.log(err);
				return res.status(404).send();
			}
			user.username = editUser.username;
			user.name = editUser.name;
			user.role_key = editUser.role_key;
			if(editUser.password.length) {
				if(editUser.password.length > 0 && editUser.password.length < 8) {
					return res.status(400).json({errMsg : i18n.t('server_msg.error_user_pwd_l_8')});
				}
				user.password = md5.update(editUser.password).digest('hex');
			}
			var new_user = new User(user);
			new_user.set('modified_user', req.session.user.username);
			new_user.set('modified_time', d.getTime());
			var err = new_user.isValid();
			if(err) {
				return res.status(400).json({errMsg : i18n.t(err)});
			}
			new_user.update(function(err) {
				if(err) {
					console.log(err);
					return res.status(404).send();
				}
				if(req.session.user.username == new_user.attrs.username) {
					req.session.user = new_user.attrs;
				}
				return res.status(200).json(new_user.attrs);
			});
		});
	},

	getById: function(req, res) {
		var id = req.params.id;
		User.getById(id, function(err, user) {
			if(err) {
				console.log(err);
				return res.status(404).send();
			}
			return res.status(200).json(user);
		});
	},

	deleteById: function(req, res) {
		var id = req.params.id;
		User.deleteById(id, function(err) {
			if(err) {
				console.log(err);
				return res.status(404).send();
			}
			return res.status(204).send();
		});
	},

	getTargets: function(req, res) {
		var username = req.params.username;
		if(typeof username === 'undefined') {
			username = req.session.user.username;
		}
		User.getUserTargets(username, function(err, targets) {
			if(err) {
				console.log(err);
				return res.status(404).send();
			}
			return res.status(200).json(targets);
		});
	},

	addOrRemoveTargets: function(req, res) {
		var username = req.params.username;
		User.addOrRemoveTargets(req.body.targets, username, function(err) {
			if(err) {
				console.log(err);
				return res.status(404).send();
			}
			return res.status(204).send();
		});
	}
};