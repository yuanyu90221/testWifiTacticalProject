
/**********
 * Account Management Controller
 **********/
var fs   = require('fs'),
	path = require('path'),
	mime = require('mime'),
	prop = require('../constant/wifitactical_prop');

module.exports = {
	index: function(req, res) {
		res.render('pktDecoder/summary', 
			{
				webType: prop.get('web.type'),
				currentFn: 'pkt-summary',
				session: req.session
			}
		);
	},

	target: function(req, res) {
		var ipv4 = req.query.ipv4;
		res.render('pktDecoder/target_summary', {ipv4: ipv4});
	},

	getFile: function(req, res) {
		var real_path = path.join(prop.get('summary.shareFolder.path'), req.query.f);
		console.log(real_path);
		if(fs.existsSync(real_path)) {
			var filename = path.basename(real_path);
			var mimetype = mime.lookup(real_path);

			//res.setHeader('Content-disposition', 'attachment; filename=' + filename);
			if(!!mimetype) {
				res.setHeader('Content-type', mimetype);
			}

			var stream = fs.createReadStream(real_path);
			stream.pipe(res);
			//var file = fs.readFileSync(real_path);
			//res.end(file);
		} else {
			return res.status(404).send();
		}
	}
};