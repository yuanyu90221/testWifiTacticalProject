
/**********
 * Summary Data Transfer
 **********/
var fs             = require('fs'),
	path           = require('path'),
	xml2js         = require('xml2js'),
	fsExtra        = require('fs.extra'),
	moment         = require('moment'),
	prop           = require('../constant/wifitactical_prop'),
	PktTarget      = require('../models/pktTarget'),
	PktSummaryData = require('../models/pktSummaryData');

var parser = new xml2js.Parser();

var SummaryDataTransfer = function() {};

SummaryDataTransfer.run = function() {
	console.log('SummaryDataTransfer is running. ' + moment().format('YYYY-MM-DD HH:mm:ss'));
	var date_folder = moment().format('YYYYMMDD');
	var base_path   = path.join(prop.get('summary.shareFolder.path'), date_folder);
	//console.log('Base Path: ' + base_path);
	
	travelFolder(base_path, function(err, folder) {
		if(!!err) {
			console.log(err);
		} else {
			var data_path       = path.join(base_path, folder, 'output'),
				xmlFilePath     = path.join(data_path, prop.get('summary.xml.filename')),
				doneFilePath    = path.join(data_path, prop.get('summary.done.filename')),
				failFilePath    = path.join(data_path, prop.get('summary.fail.filename')),
				processFilePath = path.join(data_path, prop.get('summary.process.filename'));
			if(doesDataNeedBeParsed(data_path)) {
				fs.writeFile(processFilePath, 'process');
				try {
					parseXML(xmlFilePath, function(err, data) {
						if(err) {
							console.log('Parse XML Error!!');
							console.log(err);
							throw err;
						}
						PktSummaryData.insertMultiData(data, function(err) {
							if(err) {
								console.log('Packet Summary Data was unsuccessfully inserted. [ERR]' + err);
								throw err;
							} else {
								console.log('Packet Summary Data was successfully inserted.');
							}
						});
						fs.unlinkSync(processFilePath);
						fs.writeFile(doneFilePath, 'done');
					});
				} catch(err) {
					console.log(err);
					fs.unlinkSync(processFilePath);
					fs.writeFile(failFilePath, err);
				}
			}
		}
	});
};

function travelFolder(dir, callback) {
	if(fs.existsSync(dir)) {
		fs.readdirSync(dir).forEach(function(folder) {
			callback(null, folder);
		});
	} else {
		callback('Base folder:' + dir + ' was not exist.');
	}
}

function doesDataNeedBeParsed(main_path) {
	var doneFilePath        = path.join(main_path, prop.get('summary.done.filename')),
		processFilePath     = path.join(main_path, prop.get('summary.process.filename')),
		failFilePath        = path.join(main_path, prop.get('summary.fail.filename')),
		chewbaccaOkFilePath = path.join(main_path, prop.get('summary.chewbaccaOK.filename'));
	if(!fs.existsSync(chewbaccaOkFilePath) || fs.existsSync(doneFilePath) || fs.existsSync(processFilePath) || fs.existsSync(failFilePath)) {
		return false;
	} else {
		return true;
	}
}

function parseXML(filepath, callback) {
	var data = fs.readFileSync(filepath);
	parser.parseString(data, function (err, result) {
		if(err) {
			return callback(err, null);
		}
		if(!result) {
			return callback('File: ' + filepath + ' is empty', null);
		} else if(!result.Chewbacca || typeof result.Chewbacca === 'string') {
			return callback('Chewbacca tag is empty in file: ' + filepath, null);
		} else if(!result.Chewbacca.Summary[0] || typeof result.Chewbacca.Summary[0] === 'string') {
			return callback('Summary tag is empty in file: ' + filepath, null);
		} else {
			var need = false,
				web_path = '';
				//web_path = prop.get('summary.public.path');
			var dir_arr = path.dirname(filepath).split(path.sep);
			for(var i in dir_arr) {
				if(need) {
					web_path = path.join(web_path, dir_arr[i]);
				}
				if(dir_arr[i] == 'Pcap' && !need) {
					need = true;
				}
			}
			var restructure_data = restructureData(result.Chewbacca.Summary[0].Ip, web_path);
			callback(null, restructure_data);
		}
	});
}

function restructureData(src, dir) {
	var rows = new Array();
	for(var i in src) {
		var data = src[i],
			ipv4 = data['$'].value,
			mac  = data['$'].mac;
		for(var key in data) {
			if(key !== '$') {
				var part = generateRowData(ipv4, mac, key, data[key], dir);
				rows = rows.concat(part);
			}
		}
	}
	return rows
}

function generateRowData(ipv4, mac, type, data, dir) {
	var rows = new Array();
	for(var i in data) {
		var content = data[i]['_'];
		var ts = new Date(data[i]['$'].timestamp * 1000).getTime();

		if(type.toLowerCase() == 'image') {
			content = path.join(dir, content);
		}

		var row = {
			ipv4: ipv4,
			mac: mac,
			type: type.toLowerCase(),
			data: content,
			timestamp: ts
		};
		rows.push(row);
	}
	return rows
}

module.exports = SummaryDataTransfer;
// TEST!!!
//SummaryDataTransfer.run();