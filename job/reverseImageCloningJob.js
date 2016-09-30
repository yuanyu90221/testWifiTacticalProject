
/**********
 * Reverse Data Transfer Job
 **********/
var fs           = require("fs"),
	path         = require('path'),
	CronJob      = require('cron').CronJob,
	ImageCloning = require('../module/imageCloning'),
	Chat         = require('../models/chat'),
	prop         = require('../constant/wifitactical_prop');

var job;
var ReverseImageCloningJob = function() {
	job = new CronJob(
		' * * * * *',
		function() {
			var msgId = fs.readFileSync(path.join(__dirname,'msgId.txt'), 'utf8');
			Chat.getChatContentGtId(msgId, function(err, rows) {
				for(var i in rows) {
					var row = rows[i];
					if(!!row.media_s_path) {
						var data = {
							src: path.join(prop.get('messaging.file.rootPath'), row.media_s_path),
							tar: path.join(__dirname, '../public/reverse', row.media_s_path)
						};
						ImageCloning.pushQueue(data);
					}
					if(!!row.media_b_path) {
						var data = {
							src: path.join(prop.get('messaging.file.rootPath'), row.media_b_path),
							tar: path.join(__dirname, '../public/reverse', row.media_b_path)
						};
						ImageCloning.pushQueue(data);
					}
					if(i == (rows.length - 1)) {
						fs.writeFileSync(path.join(__dirname,'msgId.txt'), row._id, 'utf8')
					}
				}
			});
			if(!ImageCloning.isRunning()) {
				ImageCloning.run();
			}
		}, null
	);
};

module.exports = new ReverseImageCloningJob();

ReverseImageCloningJob.prototype.start = function() {
	console.log('Start ReverseImageCloningJob!!!');
	job.start();
};

ReverseImageCloningJob.prototype.stop = function() {
	console.log('Stop ReverseImageCloningJob!!!');
	job.stop();
};
