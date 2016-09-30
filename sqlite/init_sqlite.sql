CREATE TABLE phishing_site(
	_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	name TEXT,
	site_key TEXT,
	created_time INTEGER
);

INSERT INTO phishing_site(name, site_key, created_time) VALUES('Facebook', 'facebook', 1414394193334);
INSERT INTO phishing_site(name, site_key, created_time) VALUES('Google', 'google', 1414394193334);
INSERT INTO phishing_site(name, site_key, created_time) VALUES('Yahoo', 'yahoo', 1414394193334);

CREATE TABLE phishing_account(
	_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	account TEXT,
	password TEXT,
	site_key TEXT,
	signin_time INTEGER
);

CREATE TABLE role(
	_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	name NVARCHAR(100),
	role_key VARCHAR(50),
	created_time INTEGER
);

INSERT INTO role(name, role_key, created_time) VALUES('user_privilege.data_role_admin', 'ROLE_ADMIN', 1414394193334);
INSERT INTO role(name, role_key, created_time) VALUES('user_privilege.data_role_user', 'ROLE_USER', 1414394193334);

CREATE TABLE user(
	_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	username TEXT,
	password TEXT,
	name NVARCHAR(100),
	role_key VARCHAR(50),
	status INTEGER,
	created_user VARCHAR(128),
	created_time INTEGER,
	modified_user VARCHAR(128),
	modified_time INTEGER
);

INSERT INTO user(username, password, name, role_key, created_user, created_time, modified_user, modified_time) VALUES('admin', '05ff890ec4a6dda338a6611bfc00ca10', 'Admin', 'ROLE_ADMIN', 1, 'system', 1414394225333, 'system', 1414394225333);

CREATE TABLE user_target(
	_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	user_id INTEGER,
	target_id INTEGER,
	target_phone TEXT,
	created_time INTEGER
);

CREATE TABLE pkt_target(
	_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	ipv4 VARCHAR(15),
	created_time INTEGER
);

CREATE TABLE pkt_summary_type(
	_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	type TEXT,
	name TEXT,
	created_time INTEGER
);

INSERT INTO pkt_summary_type(type, name, created_time) VALUES('user-agent', 'summary.data_type_user_agent', 1414394193334);
INSERT INTO pkt_summary_type(type, name, created_time) VALUES('dns', 'summary.data_type_dns', 1414394193334);
INSERT INTO pkt_summary_type(type, name, created_time) VALUES('image', 'summary.data_type_images', 1414394193334);
INSERT INTO pkt_summary_type(type, name, created_time) VALUES('account', 'summary.data_type_account', 1414394193334);
INSERT INTO pkt_summary_type(type, name, created_time) VALUES('qqtoken', 'summary.data_type_qqtoken', 1414394193334);
INSERT INTO pkt_summary_type(type, name, created_time) VALUES('requrl', 'summary.data_type_requrl', 1414394193334);

CREATE TABLE pkt_summary_data(
	_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
	ipv4 VARCHAR(15),
	type TEXT,
	data TEXT,
	created_time INTEGER
);
