
/**********
 * database Constant
 **********/
var path = require('path'),
	prop = require('properties-parser');

var prop_path = path.join(__dirname, '../prop/database.properties');
module.exports = prop.createEditor(prop_path);