
/**********
 * Chat API
 **********/
var Chat = require('../models/chat');

module.exports = {
	getChatrooms: function(req, res) {
		var i18n = req.i18n;
		var targetId = req.query.targetId;
		var app = req.query.app;
		if(typeof targetId === 'undefined' || targetId == '') {
			return res.status(400).json({errMsg : i18n.t('server_msg.error_chat_select_target')});//Target must be chosen.
		}
		if(typeof app === 'undefined' || app == '') {
			return res.status(400).json({errMsg : i18n.t('server_msg.error_chat_select_target_app')});//App must be chosen.
		}
		Chat.getChatrooms(targetId, app, function(err, chatrooms) {
			if(err) {
				console.log(err);
				return res.status(404).send();
			}
			return res.status(200).json(chatrooms);
		});
	},

	getChatContent: function(req, res) {
		var i18n = req.i18n;
		var chatId = typeof req.query.chatId === 'undefined' || req.query.chatId == '' ? null : req.query.chatId;
		var lastTime = typeof req.query.lt === 'undefined' || req.query.lt == '' ? null : req.query.lt;
		if(typeof chatId === 'undefined' || chatId == '') {
			return res.status(400).json({errMsg : i18n.t('error_chat_select_chat')});
		}
		Chat.getChatContent(chatId, lastTime, function(err, messages) {
			if(err) {
				console.log(err);
				return res.status(404).send();
			}
			return res.status(200).json(messages);
		});
	}
};