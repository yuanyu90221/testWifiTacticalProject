
/**********
 * Messaging Monitor Controller
 **********/
var fs   = require("fs"),
	path = require('path'),
	mime = require('mime'),
	prop = require('../constant/wifitactical_prop');

module.exports = {
	index: function(req, res) {
		res.render('monitor/messaging', 
			{
				webType: prop.get('web.type'),
				currentFn: 'messaging',
				session: req.session
			}
		);
	},

	getFile: function(req, res) {
		var real_path = path.join(prop.get('messaging.file.rootPath'), req.query.f);
		console.log(real_path);
		if(fs.existsSync(real_path)) {
			var filename = path.basename(real_path);
			var mimetype = mime.lookup(real_path);

			res.setHeader('Content-disposition', 'attachment; filename=' + filename);
			if(!!mimetype) {
				res.setHeader('Content-type', mimetype);
			}

			var stream = fs.createReadStream(real_path);
			stream.pipe(res);
		} else {
			return res.status(404).send();
		}
	}
};