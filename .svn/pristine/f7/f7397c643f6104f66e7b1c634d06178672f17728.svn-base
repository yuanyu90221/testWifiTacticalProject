
/**********
 * Summary Data Transfer Job
 **********/
var CronJob = require('cron').CronJob,
	ImageCloning = require('../module/imageCloning');

var job;
var SummaryImageCloningJob = function() {
	job = new CronJob(
		' * * * * *',
		function() {
			if(!ImageCloning.isRunning()) {
				ImageCloning.run();
			}
		}, null
	);
};

module.exports = new SummaryImageCloningJob();

SummaryImageCloningJob.prototype.start = function() {
	console.log('Start SummaryImageCloningJob!!!');
	job.start();
};

SummaryImageCloningJob.prototype.stop = function() {
	console.log('Stop SummaryImageCloningJob!!!');
	job.stop();
};
