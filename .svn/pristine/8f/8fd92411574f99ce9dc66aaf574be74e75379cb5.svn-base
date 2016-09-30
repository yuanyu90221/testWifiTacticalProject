
/**********
 * Summary Data Transfer Job
 **********/
var CronJob = require('cron').CronJob,
	SummaryDataTransfer = require('../module/summaryDataTransfer');

var job;
var SummaryDataTransferJob = function() {
	job = new CronJob(
		'* * * * *',
		function() {
			SummaryDataTransfer.run();
		}, null
	);
};

module.exports = new SummaryDataTransferJob();

SummaryDataTransferJob.prototype.start = function() {
	console.log('Start SummaryDataTransferJob!!!');
	job.start();
};

SummaryDataTransferJob.prototype.stop = function() {
	console.log('Stop SummaryDataTransferJob!!!');
	job.stop();
};
