/*
CREATE TABLE message_app(
	_id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
	app_name TEXT,
	created_time BIGINT
);
*/
CREATE TABLE chat(
	_id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
	target_id BIGINT,
	app_name NVARCHAR(30),
	c_id VARCHAR(128),
	chat_name TEXT,
	is_group SMALLINT
);

CREATE TABLE target(
	_id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
	phone VARCHAR(20),
	created_time BIGINT
);

CREATE TABLE target_app(
	_id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
	target_id BIGINT,
	app_name NVARCHAR(30)
);

CREATE TABLE chat_group(
	_id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
	g_id VARCHAR(128),
	m_id VARCHAR(128),
	app_name NVARCHAR(30),
	target_id BIGINT,
);

CREATE TABLE party(
	_id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
	m_id VARCHAR(128),
	name TEXT,
	app_name NVARCHAR(30),
	target_id BIGINT,
);

CREATE TABLE message(
	_id BIGINT IDENTITY(1,1) NOT NULL PRIMARY KEY,
	c_id VARCHAR(128),
	from_mid VARCHAR(128),
	content TEXT,
	send_time BIGINT,
	is_send SMALLINT,
	media_type SMALLINT,
	media_s_path TEXT,
	media_b_path TEXT
);