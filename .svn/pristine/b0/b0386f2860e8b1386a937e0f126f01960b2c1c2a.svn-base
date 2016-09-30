
/**********
 * Authorization Handle
 **********/

module.exports = {
	allow: function(req, res, next) {
		res.set({
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Methods': 'POST, GET, PUT, DELETE, OPTIONS',
			'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
			'Access-Control-Allow-Credentials': true
		});
		next();
	}
};