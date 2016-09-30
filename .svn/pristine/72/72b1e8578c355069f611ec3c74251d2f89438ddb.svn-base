
/**********
 * User Model
 **********/
var crypto = require('crypto'),
	extend = require('util')._extend,
	sqliteDB = require('../dao/sqliteDB'),
	Role = require('../models/role');

var User = function(user) {
	this.attrs = extend(this.defaults, user);
	/*_id: user._id;
	username: user.username;
	password: user.password;
	name: user.name;
	role_id: user.role_id;
	created_user: user.created_user;
	created_time: user.created_time;
	modified_user: user.modified_user;
	modified_time: user.modified_time;*/
};

module.exports = User;

User.prototype.attrs = {};
User.prototype.defaults = {
	_id: null,
	username: null,
	password: null,
	name: null,
	role_key: null,
	status: 0,
	created_user: null,
	created_time: null,
	modified_user: null,
	modified_time: null
};
User.prototype.isValid = function() {
	var emailReg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	if(typeof this.attrs.username === 'undefined' || this.attrs.username == null || this.attrs.username.length == 0) {
		return 'server_msg.error_user_act_blank';
	} else if(this.attrs.username.length > 200) {
		return 'server_msg.error_user_act_g_200';
	// } else if(!emailReg.test(this.attrs.username)) {
	// 	return 'server_msg.error_user_act_g_200';
	}
	/*if(typeof this.attrs.password === 'undefined' || this.attrs.password == null || this.attrs.password.length == 0) {
		return '密碼不可以空白！';
	} else if(this.attrs.password.length < 8) {
		return '密碼長度至少8個字元！';
	}*/
	if(typeof this.attrs.name === 'undefined' || this.attrs.name == null || this.attrs.name.length == 0) {
		return 'server_msg.error_user_name_blank';
	} else if(this.attrs.name.length < 2) {
		return 'server_msg.error_user_name_l_2';
	}
	if(typeof this.attrs.role_key === 'undefined' || this.attrs.role_key == null || this.attrs.role_key.length == 0) {
		return 'server_msg.error_user_select_role';
	}
	return null;
};
User.prototype.get = function(key) {
	return this.attrs[key];
};
User.prototype.set = function(key, value) {
	this.attrs[key] = value;
};

User.prototype.create = function(callback) {
	var md5 = crypto.createHash('md5')
	this.attrs.password = md5.update(this.attrs.password).digest('hex');
	
	var conn = sqliteDB.getConnection();
	var sql = 'INSERT INTO user(username, password, name, role_key, status, created_user, created_time, modified_user, modified_time) ' +
			'VALUES($username, $password, $name, $role_key, $status, $created_user, $created_time, $modified_user, $modified_time) ';
	var params = {
		$username:      this.attrs.username,
		$password:      this.attrs.password,
		$name:          this.attrs.name,
		$role_key:      this.attrs.role_key,
		$status:        this.attrs.status,
		$created_user:  this.attrs.created_user,
		$created_time:  this.attrs.created_time,
		$modified_user: this.attrs.modified_user,
		$modified_time: this.attrs.modified_time
	};
	console.log(sql);
	console.log(params);
	conn.run(sql, params, function(err) {
		if(err) {
			conn.close();
			return callback(err);
		}
		var sql2 = 'select last_insert_rowid() as id ';
		conn.get(sql2, function(err, oid) {
			if(err) {
				conn.close();
				return callback(err);
			}
			conn.close();
			return callback(null, oid.id);
		});
	});
};

User.prototype.update = function(callback) {
	var conn = sqliteDB.getConnection();
	var sql = 'UPDATE user SET ' +
			'username = $username, ' +
			'password = $password, ' +
			'name = $name, ' +
			'role_key = $role_key, ' +
			'status = $status, ' +
			'modified_user = $modified_user, ' +
			'modified_time = $modified_time ' +
			'WHERE _id = $_id ';
	var params = {
		$username:      this.attrs.username,
		$password:      this.attrs.password,
		$name:          this.attrs.name,
		$role_key:      this.attrs.role_key,
		$status:        this.attrs.status,
		$modified_user: this.attrs.modified_user,
		$modified_time: this.attrs.modified_time,
		$_id:           this.attrs._id
	};
	conn.run(sql, params, callback);
};

User.getByUsername = function(username, callback) {
	var conn = sqliteDB.getConnection();
	var sql = 'SELECT u.* FROM user u WHERE username = $username ';
	var params = {$username: username};
	console.log(sql);
	console.log(params);
	conn.get(sql, params, function(err, user) {
		if(err) {
			conn.close();
			return callback(err, null);
		}
		if(typeof user !== 'undefined') {
			Role.getByRoleKey(user.role_key, function(err, role) {
				if(err) {
					conn.close();
					return callback(err, null);
				}
				user.role = role;
				callback(null, user);
				conn.close();
			});
		} else {
			callback(null, null);
		}
		/*var sql2 = 'SELECT * FROM role WHERE role_key = $roleKey ';
		var params2 = {$roleKey: user.role_key};
		console.log(sql2);
		console.log(params2);
		conn.get(sql2, params2, function(err, role) {
			if(err) {
				conn.close();
				return callback(err, null);
			}
			user.role = role;
			callback(null, user);
			conn.close();
		});*/
	});
};

User.getById = function(id, callback) {
	var conn = sqliteDB.getConnection();
	var sql = 'SELECT u.* FROM user u WHERE u._id = $id ';
	var params = {$id: id};
	console.log(sql);
	console.log(params);
	conn.get(sql, params, function(err, user) {
		if(err) {
			conn.close();
			return callback(err, null);
		}
		if(typeof user !== 'undefined') {
			Role.getByRoleKey(user.role_key, function(err, role) {
				if(err) {
					conn.close();
					return callback(err, null);
				}
				user.role = role;
				callback(null, user);
				conn.close();
			});
		} else {
			callback(null, null);
		}
	});
};

User.getAll = function(callback) {
	var conn = sqliteDB.getConnection();
	conn.serialize(function() {
		var sql = 'SELECT u.*, r.name as role_name FROM user u ' +
				'JOIN role r ON u.role_key = r.role_key ';
		console.log(sql);
		conn.all(sql, function(err, users) {
			if(err) {
				conn.close();
				return callback(err, null);
			}
			callback(null, users);
		});
	});
	conn.close();
};

User.deleteById = function(id, callback) {
	var conn = sqliteDB.getConnection();
	var sql = 'DELETE FROM user WHERE _id = $id ';
	var params = {$id: id};
	console.log(sql);
	console.log(params);
	conn.run(sql, params, callback);
	conn.close();
};

User.getUserTargets = function(username, callback) {
	var conn = sqliteDB.getConnection();
	var sql = 'SELECT ut.* FROM user_target ut WHERE ut.user_id = $username ';
	var params = {$username: username};
	console.log(sql);
	console.log(params);
	conn.all(sql, params, callback);
	conn.close();
};

User.addOrRemoveTargets = function(targets, username, callback) {
	var conn = sqliteDB.getConnection();
	var sql = 'DELETE FROM user_target WHERE user_id = $username ';
	var params = {$username: username};
	console.log(sql);
	console.log(params);
	conn.run(sql, params, function(err) {
		if(err) {
			conn.close();
			return callback(err);
		}
		conn.serialize(function() {
			var d = new Date();
			var sql2 = 'INSERT INTO user_target(user_id, target_id, target_phone, created_time) ' +
					'VALUES($username, $target_id, $target_phone, $created_time) ';
			var stmt = conn.prepare(sql2);
			console.log(sql2);
			for(var i in targets) {
				var params2 = {
					$username:      username,
					$target_id:  targets[i].id,
					$target_phone:  targets[i].phone,
					$created_time:  d.getTime()
				};
				console.log(params2);
				stmt.run(params2);
			}
			stmt.finalize(callback);
		});
		conn.close();
	});
};