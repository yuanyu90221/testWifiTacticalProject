! function($) {
	"use strict";

	var $par = undefined;

	var tpl_message_panel = '<div class="messagePanel"></div>';
	var tpl_btn_close = '<div class="btn-space"><a class="btn btn_close" href="javascript:;"><i class="icon-cancel"></i></a></div>';

	$.notice = function(options) {
		install();
		if(typeof options === 'undefined') return;
		else if(typeof options === 'string') var opt = $.extend({}, this.defaults, {message: options});
		else if(typeof options === 'object') var opt = $.extend(true, {}, this.defaults, options);

		var $msg = $('<p>' + opt.message + '</p>');
		var $btnSpace = $(tpl_btn_close);
		$('.btn_close', $btnSpace).on('click', closeNotice);
		var $msgPanel = $(tpl_message_panel);
		if(opt.type == $.notice.types.SUCCESS.toLowerCase()) {
			$msgPanel.addClass('success');
		} else if(opt.type == $.notice.types.ERROR.toLowerCase()) {
			$msgPanel.addClass('error');
		}
		$msgPanel.append($msg)
				.append($btnSpace).appendTo($par);

		var mt = 11 + $msgPanel.height() + 10;
		$msgPanel.css('margin-top', '-' + mt + 'px');
		$msgPanel.animate({opacity: 1, marginTop: 0}, 800);

		setTimeout(function() {
			remove($msgPanel);
		}, 5000);
	}

	$.notice.types = {
		SUCCESS: 'success',
		ERROR: 'error',
		NORMAL: 'normal'
	};

	$.notice.defaults = {
		message : '',
		type: $.notice.types.NORMAL
	};

	function install() {
		if(!$('.message-notice').length) {
			$par = $('<div>').addClass('message-notice').appendTo('body');
		} else {
			$par = $('.message-notice');
		}
	}

	function closeNotice() {
		remove($(this).parents('.messagePanel'));
	}
	
	function remove(msgPanel) {
		msgPanel.fadeOut('slow', function() {
			$(this).remove();
		});
	}
}(jQuery);