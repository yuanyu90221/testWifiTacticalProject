/**********
 * sqlite connector
 **********/

var path = require('path'),
	sqlite3 = require("sqlite3").verbose();

module.exports = {
	getConnection: function() {
		var db_path = path.join(__dirname, '../sqlite/wifitactical.db');
		return new sqlite3.Database(db_path);
	}
};