
/**********
 * Summary Image Cloning
 **********/
var fs      = require("fs"),
	path    = require('path'),
	fsExtra = require('fs.extra');

var ImageCloning = function() {};

var imageQueue = new Array(),
	running = false;

ImageCloning.run = function(callback) {
	running = true;
	console.log('Queue Size : ' + imageQueue.length);
	if(!!imageQueue.length) {
		var row = imageQueue.shift();
		cpFile(row.src, row.tar, function(err) {
			if(err) {
				console.log('Copy fail.');
				console.log(err);
			} else {
				console.log('Copy done.');
			}
			ImageCloning.run();
		});
	} else {
		running = false;
		if(typeof callback == 'function') {
			callback();
		}
	}
};

ImageCloning.pushQueue = function(row) {
	imageQueue.push(row);
};

ImageCloning.isRunning = function() {
	return running;
};

function cpFile(src, tar, callback) {
	console.log('Copy ' + src + ' to ' + tar);
	if(!fs.existsSync(src)) {
		callback('Source file: ' + src + ' was not exist.');
	} else if(fs.existsSync(tar)) {
		callback('Target file: ' + tar + ' was exist.');
	} else {
		var tar_path = path.dirname(tar)
		if(fs.existsSync(tar_path)) {
			fsExtra.copy(src, tar, function(err) {
				callback(err);
			});
		} else {
			fsExtra.mkdirRecursive(tar_path, function(err) {
				if(err) {
					callback(err);
				} else {
					cpFile(src, tar, callback);
				}
			});
		}
	}
}

module.exports = ImageCloning;

/*SummaryImageCloning.pushQueue({
	src: 'D:/test/1/1_s.jpg',
	tar: 'D:/99_workspaces/workspace_05/WiFiTactical/public/test/1/1_s.jpg'
});
SummaryImageCloning.pushQueue({
	src: 'D:/test/1/1_b.jpg',
	tar: 'D:/99_workspaces/workspace_05/WiFiTactical/public/test/1/1_b.jpg'
});

SummaryImageCloning.run();*/