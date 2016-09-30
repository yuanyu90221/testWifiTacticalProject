
/**********
 * Target Model
 **********/
var extend = require('util')._extend;
var mssql = require('mssql');
var databaseProp = require('../constant/database_prop');

var dataSource = {
	user: databaseProp.get('database.mssql.username'),
	password: databaseProp.get('database.mssql.password'),
	server: databaseProp.get('database.mssql.url'),
	database: databaseProp.get('database.mssql.database'),
	options: {
		encrypt: false
	}
};

var Chat = function(chat) {
	
};

module.exports = Chat;

Chat.getChatrooms = function(targetId, app, callback) {
	var conn = new mssql.Connection(dataSource);
	conn.connect(function(err) {
		if(err) {
			callback(err, null);
		} else {
			var sql = 'SELECT c.c_id as chatId, ' +
					'chatName = CASE ' +
					'WHEN (c.is_group = 0) THEN (SELECT p.name FROM party p WHERE p.m_id = c.c_id AND p.target_id = c.target_id) ' +
					'WHEN (c.is_group = 1 and DATALENGTH(c.chat_name) > 0) THEN c.chat_name ' +
					'ELSE ( ' +
					'SELECT STUFF(( ' +
					'SELECT \'; \' + CONVERT(nvarchar(MAX), p.name) ' +
					'FROM chat_group b ' +
					'INNER JOIN party p ON p.m_id = b.m_id ' +
					'WHERE b.g_id = a.g_id ' +
					'FOR XML PATH(\'\') ' +
					'), 1, 1, \'\') ' +
					'FROM chat_group a ' +
					'WHERE a.g_id = c.c_id ' +
					'GROUP BY a.g_id ' +
					') ' +
					'END ' +
					'FROM chat c ' +
					'WHERE c.target_id = @id ' +
					'AND c.app_name = @app ';
			var request = new mssql.Request(conn);
			request.input('id', mssql.Int, targetId);
			request.input('app', mssql.NVarChar, app);
			console.log('[sql] ' + sql);
			console.log('@id= ' + targetId);
			console.log('@app= ' + app);
			request.query(sql, function(err, recordsets) {
				callback(err, recordsets);
			});
		}
		conn.close();
	});
};

Chat.getChatContent = function(chatId, lastTime, callback) {
	var conn = new mssql.Connection(dataSource);
	conn.connect(function(err) {
		if(err) {
			callback(err, null);
		} else {
			/*var sql = 'SELECT m.*, p.name as party_name FROM message m ' +
					'LEFT JOIN party p ON m.from_mid = p.m_id ' +
					'WHERE m.c_id = @chatId ';
			if(lastTime) {
				sql += 'AND m.send_time > @lastTime ';
			}
			sql += 'ORDER BY m.send_time ASC ';*/

			var sql = 'SELECT A.c_id, A.from_mid, A.content, A.send_time, A.is_send, ' +
					'A.media_type, A.media_s_path, A.media_b_path, A.party_name ' +
					'FROM ( ' +
					'SELECT m.c_id, m.from_mid, m.content, m.send_time, m.is_send, ' +
					'm.media_type, m.media_s_path, m.media_b_path, p.name as party_name, ' +
					'ROW_NUMBER() OVER(PARTITION BY m.send_time ORDER BY m._id DESC) AS row ' +
					'FROM message m ' +
					'LEFT JOIN party p ON m.from_mid = p.m_id ' +
					'WHERE m.c_id = @chatId ' +
					') AS A ' +
					'WHERE A.row = 1 ';
			if(lastTime) {
				sql += 'AND A.send_time > @lastTime ';
			}
			sql += 'ORDER BY A.send_time ASC ';

			var request = new mssql.Request(conn);
			request.input('chatId', chatId);
			if(lastTime) {
				request.input('lastTime', lastTime);
			}
			console.log('[sql] ' + sql);
			console.log('@chatId= ' + chatId);
			if(lastTime) {
				console.log('@lastTime= ' + lastTime);
			}
			request.query(sql, function(err, recordsets) {
				callback(err, recordsets);
			});
		}
		conn.close();
	});
};

Chat.getChatContentGtId = function(msgId, callback) {
	var conn = new mssql.Connection(dataSource);
	conn.connect(function(err) {
		if(err) {
			callback(err, null);
		} else {
			var sql = 'select * from message ' +
					'where _id > @msgId ' +
					'and media_type > 0 ';
			var request = new mssql.Request(conn);
			request.input('msgId', msgId);
			console.log('[sql] ' + sql);
			console.log('@msgId= ' + msgId);
			request.query(sql, function(err, recordsets) {
				callback(err, recordsets);
			});
		}
		conn.close();
	});
};