
/**********
 * User Controller
 **********/
var crypto = require('crypto'),
	extend = require('util')._extend,
	User = require('../models/user'),
	Role = require('../models/role'),
	prop = require('../constant/wifitactical_prop'),
	mailSender = require('../module/mailSender');

var MT_SYSTEM_ERROR = 0,
	MT_REGISTER_SUCCESS = 1,
	MT_ACCOUNT_INACTIVATE = 2,
	MT_ACTIVATE_SUCCESS = 3,
	MT_ACTIVATE_ERROR = 4,
	MT_ACCOUNT_REACTIVATE = 5;

var loginParam = {
	account: '',
	passwd: ''
};

module.exports = {
	login: function(req, res) {
		//var i18n = req.i18n;
		//console.log('================================== ' + i18n.t('btn.signin'));
		return res.render('user/login', loginParam);
	},
	
	logon: function(req, res) {
		var i18n = req.i18n;
		var act = req.body.account;
		var pwd  = req.body.passwd;
		var model;
		if(typeof act === 'undefined' || act == '') {
			model = { errMsg: i18n.t('login.msg.enter_account') };
			model = extend(model, req.body);
			return res.render('user/login', model);
		}
		if(typeof pwd === 'undefined' || pwd == '') {
			model = { errMsg: i18n.t('login.msg.enter_password') };
			model = extend(model, req.body);
			return res.render('user/login', model);
		}
		var md5 = crypto.createHash('md5'),
			md5pwd = md5.update(pwd).digest('hex');
		User.getByUsername(act, function(err, user) {
			if(err) { // 系統錯誤
				console.log(err);
				model = { errMsg: i18n.t('login.msg.wrong_act_pwd') };
				model = extend(model, req.body);
				return res.render('user/login', model);
			}
			if(user == null) { // 查不到帳號
				model = { errMsg: i18n.t('login.msg.wrong_act_pwd') };
				model = extend(model, req.body);
				return res.render('user/login', model);
			}
			if(user.status == 0) { // 帳號未啟用
				return res.render('user/message', {
					mt: MT_ACCOUNT_INACTIVATE
				});
			}
			if(md5pwd != user.password) { // 密碼不正確
				model = { errMsg: i18n.t('login.msg.wrong_act_pwd') };
				model = extend(model, req.body);
				return res.render('user/login', model);
			}
			req.session.user = user;
			var type = prop.get('web.type');
			res.cookie('crt', user._id);
			res.cookie('wt', prop.get('web.type'));
			//app.index.cib
			return res.redirect(prop.get('app.index.' + type));
		});
	},

	logout: function(req, res) {
		res.clearCookie('crt');
		res.clearCookie('wt');

		delete req.session.user;
		req.session.destroy();
		req.session = null;
		
		res.redirect('/login');
	},

	signup: function(req, res) {
		res.render('user/signup', {
			account: '',
			passwd: '',
			name: ''
		});
	},

	register: function(req, res) {
		var i18n = req.i18n;
		var d = new Date();

		var act = req.body.account,
			pwd  = req.body.passwd,
			name  = req.body.name;

		var user = new User();
		user.set('username', act);
		user.set('password', pwd);
		user.set('name', name);
		user.set('role_key', 'ROLE_USER');
		user.set('created_user', 'system');
		user.set('created_time', d.getTime());
		user.set('modified_user', 'system');
		user.set('modified_time', d.getTime());

		var err = user.isValid();
		var model;
		if(err) {
			model = { errMsg: i18n.t(err) };
			model = extend(model, req.body);
			return res.render('user/signup', model);
		}
		if(user.get('password').length < 8) {
			model = { errMsg: i18n.t('server_msg.error_user_pwd_l_8') };
			model = extend(model, req.body);
			return res.render('user/signup', model);
		}
		User.getByUsername(user.get('username'), function(err, ouser) {
			if(err) {
				console.log(err);
				model = { errMsg: i18n.t('msg.error_cannot_create_act') };
				model = extend(model, req.body);
				return res.render('user/signup', model);
			}
			if(ouser) {
				model = { errMsg: i18n.t('server_msg.error_user_act_exist', {username: ouser.username}) };
				model = extend(model, req.body);
				return res.render('user/signup', model);
			}
			user.create(function(err, id) {
				if(err) {
					console.log(err);
					model = { errMsg: i18n.t('msg.error_cannot_create_act') };
					model = extend(model, req.body);
					return res.render('user/signup', model);
				} else {
					console.log('new user id = ' + id);
					User.getById(id, function(err, user) {
						if(err) {
							console.log(err);
							return res.render('user/message', {
								mt: MT_SYSTEM_ERROR
							});
						} else {
							// send mail!!!
							var sender = mailSender.createSender();
							sender.sendActivatingAccountMail(user, i18n, function(error, info) {
								if(error) {
									console.log(error);
									return res.render('user/message', {
										mt: MT_SYSTEM_ERROR
									});
								} else {
									console.log('Message sent: ' + info.response);
									return res.render('user/message', {
										mt: MT_REGISTER_SUCCESS
									});
								}
							});
						}
					});
				}
			});
		});
	},

	activate: function(req, res) {
		var k = req.query.k,
			p = req.query.p;
		if(typeof k === 'undefined' || k == '' || typeof p === 'undefined' || p == '') {
			return res.render('user/message', {
				mt: MT_ACTIVATE_ERROR
			});
		} else {
			User.getById(k, function(err, user) {
				if(err) {
					console.log(err);
					res.render('user/message', {
						mt: MT_SYSTEM_ERROR
					});
				} else {
					var md5 = crypto.createHash('md5')
					var md5username = md5.update(user.username).digest('hex');
					if(md5username === p) {
						// 修改user status
						var d = new Date();
						user.status = 1;
						var new_user = new User(user);
						new_user.set('modified_user', 'system');
						new_user.set('modified_time', d.getTime());
						var err = new_user.isValid();
						if(err) {
							console.log(err);
							return res.render('user/message', {
								mt: MT_ACTIVATE_ERROR
							});
						} else {
							new_user.update(function(err) {
								if(err) {
									console.log(err);
									return res.render('user/message', {
										mt: MT_ACTIVATE_ERROR
									});
								} else {
									return res.render('user/message', {
										mt: MT_ACTIVATE_SUCCESS
									});
								}
							});
						}
					} else {
						return res.render('user/message', {
							mt: MT_ACTIVATE_ERROR
						});
					}
				}
			});
		}
	},

	getReactivateMail: function(req, res) {
		return res.render('user/message', {
			mt: MT_ACCOUNT_REACTIVATE
		});
	},

	sendReactivateMail: function(req, res) {
		var i18n = req.i18n;

		var act = req.body.account,
			pwd  = req.body.passwd;

		User.getByUsername(act, function(err, user) {
			if(err) {
				console.log(err);
				res.render('user/message', {
					mt: MT_SYSTEM_ERROR
				});
			} else {
				var md5 = crypto.createHash('md5'),
					md5pwd = md5.update(pwd).digest('hex');
				if(md5pwd != user.password) { // 密碼不正確
					return res.render('user/message', {
						mt: MT_ACCOUNT_REACTIVATE,
						errMsg: i18n.t('login.msg.wrong_act_pwd')
					});
				}
				// send mail!!!
				var sender = mailSender.createSender();
				sender.sendActivatingAccountMail(user, i18n, function(error, info) {
					if(error) {
						console.log(error);
						return res.render('user/message', {
							mt: MT_SYSTEM_ERROR
						});
					} else {
						console.log('Message sent: ' + info.response);
						return res.render('user/message', {
							mt: MT_REGISTER_SUCCESS
						});
					}
				});
			}
		});
	}
};