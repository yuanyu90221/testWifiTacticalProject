
/**********
 * Mail Sender
 **********/
var crypto = require('crypto'),
	nodemailer = require('nodemailer'),
	smtpTransport = require('nodemailer-smtp-transport'),
	extend = require('util')._extend,
	prop = require('../constant/wifitactical_prop');

module.exports.createSender = function() {
	return new Sender();
};

function Sender() {
	this._options = {
		from: '"NetStream " <test@gmail.com>',
		to: null,
		subject: null,
		html: null
	};

	this.transporter = nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: 'test@gmail.com',
			pass: '123qweasd'
		}
	});
}

Sender.prototype.sendActivatingAccountMail = function(user, i18n, callback) {
	var md5 = crypto.createHash('md5')
	var md5username = md5.update(user.username).digest('hex');
	var link = 'http://' + (prop.get('web.host').length > 0 ? prop.get('web.host') : prop.get('web.ip')) + ':3000/activate?p=' + md5username + '&k=' + user._id;

	var subject = i18n.t('mail.registration.subject');
	var content = i18n.t('mail.registration.content', {account: user.username, confirmLink: link});
	var mail = extend(this._options, {
		to: user.username,
		subject: subject,
		html: content
	});
	this.transporter.sendMail(mail, callback);
}