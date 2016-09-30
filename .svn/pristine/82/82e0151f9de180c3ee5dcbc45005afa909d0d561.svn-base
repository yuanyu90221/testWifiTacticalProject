! function(window) {
	if(!window.WT) {
		window.WT = {};
	}
	var WT = window.WT;
}(window);
! function(WT) {
	WT.Common = WT.Common || {};
	WT.Common.Auth = function() {
	}
	WT.Common.Auth.isLogin = function(status) {
		//console.log('=======================> status: ' + status);
		if(status == 401) {
			$.notice({
				message: $.t('msg.error_session_timeout'),
				type: 'error'
			});
			setTimeout(function() {
				window.location.href = '/';
			}, 5*1E3);
		}
	}
}(WT);
/**********
 * jquery plugin
 **********/
jQuery.expr[':'].containsIgnorecase = function(a, i, m) {
	return jQuery(a).text().toUpperCase().indexOf(m[3].toUpperCase())>=0;
};
/**********
 * navigation
 **********/
! function(WT) {
	var that;
	WT.Views = WT.Views || {};
	WT.Views.Navigation = function(el) {
		that = this;
		this.el = el;
		this.init();

		// Event
		$('#gear', this.$el).on('click', function() {
			var par = $(this).parent();
			var menu = par.find('.gear-menu');
			var tp = $(par[0]).position().top + $(par[0]).height();
			var rp = $(par[0]).position().right + $(menu[0]).width();
			var $menu = $(menu[0]).css({top: tp, right: rp}).toggle('slow', function() {
				if($menu.is(':visible')) {
					$(document).on('mousedown', _checkExternalClick);
				}
			});
		});

		$('#btn_account_setting', this.$el).on('click', function() {
			_closeGearMenu();
			//var _id = $(this).siblings('input[type=hidden]').val();
			var _id = $.cookie('crt');
			$.ajax({
				contentType: 'application/json',
				type: 'GET',
				url: '/api/v1/users/' + _id,
				dataType: 'json',
				cache: false,
				success: function(resp, status, xhr) {
					that.openAccountFormDialog(resp);
				},
				error: function(xhr, status, error) {
					$.notice({
						message: $.t('msg.error_cannot_get_act'),
						type: 'error'
					});
				}
			});
		});

		$('#setLang', this.$el).on('change', function() {
			var _lang = $(this).val();
			location.replace(location.pathname + '?lang=' + _lang);
		});

		var _checkExternalClick = function(e) {
			var $target = $(e.target);
			var mainClass = 'gear-menu';
			if(!(
					$target.hasClass(mainClass) ||
					$target.closest('.' + mainClass).length
			)) {
				if($('.gear-menu').is(':visible')) {
					_closeGearMenu();
				}
			}
		};

		var _closeGearMenu = function() {
			$('.gear-menu').hide('slow');
		};
	};
	
	WT.Views.Navigation.prototype = {
		init: function() {
			this.$el = $(this.el);
			var _lang = $.cookie('lang');
			$('#setLang', this.$el).val(_lang);
		},

		openAccountFormDialog: function(user) {
			var tpl = _.template($('#tpl_dialog_account_form').html());
			var $tpl = $(tpl(user));
			$tpl.i18n();
			var dl = $tpl.dialog({
				minHeight: 370,
				minWidth: 420,
				modal: true,
				resizable: false,
				title: $.t('tpl.header.account_setting'),
				close: function(event, ui) {
					dl.dialog('destroy');
				}
			}).on('click', '#btn_cancel', function() {
				dl.dialog('close');
			}).on('click', '#btn_submit', function() {
				var user = $('#user_form', $tpl).serializeJSON();
				that.saveUser(user)
					.done(function() {
						dl.dialog('close');
						$.notice({
							message: $.t('msg.success_setting_act'),
							type: 'success'
						});
						$('#show_name', that.$el).text(user.name);
						if(!!WT.Views.accountManagement) {
							WT.Views.accountManagement.renderUserList();
						}
					})
					.fail(function(err) {
						if(err) {
							$('.err-msg', $tpl).text(err);
							$('.err-msg-sq', $tpl).show();
						} else {
							$.notice({
								message: $.t('msg.error_setting_act'),
								type: 'error'
							});
						}
					});
			});
		},

		saveUser: function(user) {
			var _dfd = $.Deferred();
			var err = '';
			if(err) {
				return _dfd.reject(err);
			}
			$.ajax({
				contentType: 'application/json',
				type: 'PUT',
				url: '/api/v1/users/' + user._id,
				dataType: 'json',
				data: JSON.stringify(user),
				cache: false,
				success: function(resp, status, xhr) {
					return _dfd.resolve(resp);
				},
				error: function(xhr, status, error) {
					if(xhr.status == 400) {
						return _dfd.reject({err: xhr.responseJSON.errMsg});
					} else {
						return _dfd.reject(null);
					}
				}
			});
			return _dfd.promise();
		}
	};
}(WT);
/**********
 * AccountManagement
 **********/
! function(WT) {
	var that;
	WT.Views = WT.Views || {};
	WT.Views.AccountManagement = function(el) {
		that = this;
		
		this.el = el;
		this.init();
		
		// Event
		$('#btn_add_user', this.$el).on('click', function() {
			var user = $.extend({}, that.defaults);
			that.openUserFormDialog(user, {title : $.t('user_privilege.add_account_dialog_title'), action: 'POST'});
		});
	};

	WT.Views.AccountManagement.prototype = {
		init: function() {
			this.$el = $(this.el);
			this.getRoles().done(function() {
				that.renderUserList();
			});
		},

		defaults: {
			_id: null,
			username: null,
			password: null,
			name: null,
			role_key: null,
			status: 1,
			created_user: null,
			created_time: null,
			modified_user: null,
			modified_time: null
		},

		getRoles: function() {
			var _dfd = $.Deferred();
			$.ajax({
				contentType: 'application/json',
				type: 'GET',
				url: '/api/v1/roles',
				dataType: 'json',
				cache: false,
				success: function(resp, status, xhr) {
					that.roles = resp;
					return _dfd.resolve();
				},
				error: function(xhr, status, error) {
					return _dfd.reject();
				}
			});
			return _dfd.promise();
		},

		getUsers: function() {
			$.blockUI({ message: '<h3 style="margin: 10px 0;"><i class="icon-spin5 animate-spin"></i></h3>' });
			$.ajax({
				contentType: 'application/json',
				type: 'GET',
				url: '/api/v1/users',
				dataType: 'json',
				cache: false,
				success: function(resp, status, xhr) {
					for(var i in resp) {
						that.appendRow(resp[i]);
					}
				},
				error: function(xhr, status, error) {
					$.notice({
						message: $.t('msg.error_cannot_get_act_list'),
						type: 'error'
					});
				},
				complete: function(xhr, status) {
					$.unblockUI();
				}
			});
		},

		isValidUser: function(user) {
			if(typeof user.username === 'undefined' || user.username == null || user.username.length == 0) {
				return $.t('msg.error_act_blank');
			} else if(user.username.length > 50) {
				return $.t('msg.error_act_g_50');
			}
			/*if(typeof user.password === 'undefined' || user.password == null || user.password.length == 0) {
				return '密碼不可以空白！';
			} else if(user.password.length < 8) {
				return '密碼長度至少8個字元！';
			}*/
			if(typeof user.name === 'undefined' || user.name == null || user.name.length == 0) {
				return $.t('msg.error_name_blank');
			} else if(user.name.length < 2) {
				return $.t('msg.error_name_l_2');
			}
			if(typeof user.role_key === 'undefined' || user.role_key == null || user.role_key.length == 0) {
				return $.t('msg.error_select_role');
			}
			return null;
		},

		saveUser: function(user, action) {
			var _dfd = $.Deferred();
			var err = '';
			if(action.toLowerCase() == 'put') { // update
				if(typeof user.password !== 'undefined' && user.password != null && user.password.length > 0 && user.password.length < 8) {
					err = $.t('msg.error_pwd_l_8');
				}
			}
			if(action.toLowerCase() == 'post') { // create
				if(typeof user.password === 'undefined' || user.password == null || user.password.length == 0) {
					err = $.t('msg.error_pwd_blank');
				} else if(user.password.length < 8) {
					err = $.t('msg.error_pwd_l_8');
				}
			}
			err = this.isValidUser(user);
			if(err) {
				return _dfd.reject(err);
			}
			var resourceURL = '/api/v1/users' + (action.toLowerCase() == 'put' ? '/' + user._id : '');
			$.ajax({
				contentType: 'application/json',
				type: action,
				url: resourceURL,
				dataType: 'json',
				data: JSON.stringify(user),
				cache: false,
				success: function(resp, status, xhr) {
					return _dfd.resolve(resp);
				},
				error: function(xhr, status, error) {
					if(xhr.status == 400) {
						return _dfd.reject({err: xhr.responseJSON.errMsg});
					} else {
						return _dfd.reject(null);
					}
				}
			});
			return _dfd.promise();
		},

		deleteUser: function(id) {
			var _dfd = $.Deferred();
			$.ajax({
				contentType: 'application/json',
				type: 'DELETE',
				url: '/api/v1/users/' + id,
				dataType: 'json',
				cache: false,
				success: function(resp, status, xhr) {
					return _dfd.resolve();
				},
				error: function(xhr, status, error) {
					return _dfd.reject();
				}
			});
			return _dfd.promise();
		},

		saveUserTargets: function(targets, username) {
			$.ajax({
				contentType: 'application/json',
				type: 'POST',
				url: '/api/v1/user_targets/' + username,
				dataType: 'json',
				data: JSON.stringify(targets),
				cache: false,
				success: function(resp, status, xhr) {
					$.notice({
						message: $.t('msg.success_add_remove_target'),
						type: 'success'
					});
				},
				error: function(xhr, status, error) {
					$.notice({
						message: $.t('msg.error_add_remove_target'),
						type: 'error'
					});
				}
			});
		},

		renderUserList: function() {
			$('#user_list > tbody', this.$el).empty();
			this.getUsers();
		},

		openUserFormDialog: function(user, options) {
			var tpl = _.template($('#tpl_dialog_user_form').html());
			var $tpl = $(tpl(user));
			$tpl.i18n();
			this.appendRoleOptions($('#role_key', $tpl));
			$('#role_key', $tpl).val(user.role_key);
			var dl = $tpl.dialog({
				minHeight: 370,
				minWidth: 420,
				modal: true,
				resizable: false,
				title: options.title,
				close: function(event, ui) {
					dl.dialog('destroy');
				}
			}).on('click', '#btn_cancel', function() {
				dl.dialog('close');
			}).on('click', '#btn_submit', function() {
				var user = $('#user_form', $tpl).serializeJSON();
				/*var actString = '';
				if(options.action.toLowerCase() == 'put') {
					actString = '修改';
				} else if(options.action.toLowerCase() == 'post') {
					actString = '新增';
				} else {
					actString = '新增或修改';
				}*/
				that.saveUser(user, options.action)
					.done(function() {
						$.notice({
							//message: actString + '帳號成功！',
							message: $.t('msg.success_save_act'),
							type: 'success'
						});
						dl.dialog('close');
						that.renderUserList();
					})
					.fail(function(err) {
						if(err) {
							$('.err-msg', $tpl).text(err);
							$('.err-msg-sq', $tpl).show();
						} else {
							$.notice({
								message: $.t('msg.error_cannot_save_act'),
								type: 'error'
							});
						}
					});
			});
		},

		openMappingFormDialog: function(options, callback) {
			var tpl = _.template($('#tpl_dialog_mapping_form').html());
			options.infoDescription = $.t('user_privilege.linking.msg_link_target_info', {username: options.name});
			var $tpl = $(tpl(options));
			$tpl.i18n();
			var dl = $tpl.dialog({
				minHeight: 380,
				minWidth: 500,
				modal: true,
				resizable: false,
				title: $.t('user_privilege.linking.dialog_title'),
				close: function(event, ui) {
					dl.dialog('destroy');
				}
			}).on('click', '#btn_cancel', function() {
				dl.dialog('close');
			}).on('click', '#btn_submit', function() {
				var targets = new Array();
				$('input:checkbox:checked', $tpl).each(function() {
					var target = {};
					var $this = $(this);
					target.phone = $this.val();
					target.id = $this.siblings('input:hidden').val();
					targets.push(target);
				});
				callback({targets: targets});
				dl.dialog('close');
			});
		},

		openConfirmDialog: function(options, callback) {
			var tpl = _.template($('#tpl_dialog_confirm_form').html());
			var $tpl = $(tpl({message: options.message}));
			$tpl.i18n();
			var dl = $tpl.dialog({
				minHeight: 160,
				minWidth: 320,
				modal: true,
				resizable: false,
				title: options.title,
				close: function(event, ui) {
					dl.dialog('destroy');
				}
			}).on('click', '#btn_cancel', function() {
				callback(false);
				dl.dialog('close');
			}).on('click', '#btn_submit', function() {
				callback(true);
				dl.dialog('close');
			});
		},

		appendRow: function(data) {
			var tpl = _.template($('#tpl_table_row').html());
			var $tpl = $(tpl(data));
			$tpl.i18n();
			var _id = $.cookie('crt');
			if(_id == data._id) {
				$('td:last > a:not(:first)', $tpl).remove();
			}
			var wt = $.cookie('wt');
			if(wt == 'wifitactical') {
				$('td:last > a:first', $tpl).remove();
			}
			$('.td_status', $tpl).text($.t('user_privilege.status' + data.status));
			$tpl.appendTo($('#user_list > tbody', this.$el))
				.on('click', '#btn_mapping', function() {
					var _id = $(this).siblings('input[type=hidden]').val();
					var username = $(this).parent().siblings('.td_username').text();
					var name = $(this).parent().siblings('.td_name').text();
					that.getTargets4MappingDialog(_id, username, name);
				})
				.on('click', '#btn_edit', function() {
					var _id = $(this).siblings('input[type=hidden]').val();
					that.getUser4FormDialog(_id);
				})
				.on('click', '#btn_delete', function() {
					var _id = $(this).siblings('input[type=hidden]').val();
					var username = $(this).parent().siblings('.td_username').text();
					that.openDeleteDialog(_id, username);
				});
		},

		appendRoleOptions: function($tar) {
			for(var i in this.roles) {
				var role = this.roles[i];
				$('<option>').val(role.role_key).text($.t(role.name)).appendTo($tar);
			}
		},

		getTargets4MappingDialog: function(id, username, name) {
			var a1 = $.ajax({
				contentType: 'application/json',
				type: 'GET',
				url: '/api/v1/targets',
				cache: false,
				dataType: 'json'
			});
			var a2 = $.ajax({
				contentType: 'application/json',
				type: 'GET',
				url: '/api/v1/user_targets/' + username,
				cache: false,
				dataType: 'json'
			});
			$.when(a1, a2).then(
				function(v1, v2) {
					that.openMappingFormDialog(
						{
							id: id,
							username: username,
							name: name,
							targets: v1[0],
							user_targets: v2[0]
						},
						function(userTargets) {
							that.saveUserTargets(userTargets, username);
						}
					);
				}, 
				function(e1, e2) {
					$.notice({
						message: $.t('msg.error_cannot_get_target'),
						type: 'error'
					});
				}
			);
		},

		getUser4FormDialog: function(id) {
			$.ajax({
				contentType: 'application/json',
				type: 'GET',
				url: '/api/v1/users/' + id,
				dataType: 'json',
				cache: false,
				success: function(resp, status, xhr) {
					that.openUserFormDialog(resp, {title : $.t('user_privilege.edit_account_dialog_title'), action: 'PUT'});
				},
				error: function(xhr, status, error) {
					$.notice({
						message: $.t('msg.error_cannot_get_act'),
						type: 'error'
					});
				}
			});
		},

		openDeleteDialog: function(id, username) {
			var options = {
				title: $.t('user_privilege.delete_account_dialog_title'),
				message: $.t('user_privilege.msg_delete_act_info', {'username': username})
			};
			this.openConfirmDialog(options, function(flg) {
				if(flg) {
					that.deleteUser(id)
						.done(function() {
							that.renderUserList();
						})
						.fail(function() {
							$.notice({
								message: $.t('msg.error_cannot_delete_act'),
								type: 'error'
							});
						});
				}
			});
		}
	};
}(WT);
/**********
 * FakeAp
 **********/
! function(WT) {
	var that;
	WT.FakeApStatusProvider = function() {
		var getRetriever = function(options) {
			var DataRetriever = function(options) {
				that = this;
				this._dfd = $.Deferred();
				this.options = $.extend({}, this.defaults, options);
			};

			DataRetriever.prototype = {
				defaults: {},
				statusData: {},
				doRetrieve: function() {
					this.ajXHR = $.ajax({
						contentType: 'application/json',
						type: this.options.method,
						url: this.options.url,
						dataType: 'json',
						async: false,
						data: this.options.params,
						cache: false
					}).done(function(data, status, xhr) {
						that.feed(data);
						if(that.recall) that.recall.apply(that);
					}).fail(function(xhr, status, error) {
						that._dfd.reject(xhr);
					});
				},
				feed: function(data) {
					this.statusData = data;
					WT.Views.fakeAp.renderStatusInfo(data.attackStatus.tasks, data.attackStatus.targetBssid, data.attackStatus.targetStation);
					if(data.success && this.validate(data.attackStatus.tasks)) {
						this._dfd.resolve();
					} else {
						WT.Views.fakeAp.stopInitStatusData();
						this._dfd.reject();
						// TODO show error message
					}
				},
				recall: function(callback) {
					if(typeof callback !== 'undefined')
						this._dfd.done(callback);
				},
				validate: function(tasks) {
					for(var i in tasks) {
						var task = tasks[i];
						if(!task.done && !!task.errmsg) {
							return false;
						}
						if(i == (tasks.length - 1) && task.done) {
							return false;
						}
					}
					return true;
				},
				stop: function() {
					console.log(this.ajXHR);
					if(!!this.ajXHR) {
						this.ajXHR.abort();
					}
					that._dfd.reject();
				}
			};

			return new DataRetriever(options);
		};
		return {
			getRetriever: getRetriever
		}
	}();
}(WT);
! function(WT) {
	var that;
	WT.Views = WT.Views || {};
	WT.Views.FakeAp = function(el) {
		that = this;
		this.el = el;

		// Event
		$('.btn-scan', this.$el).on('click', function() {
			$.blockUI({ message: '<h3 style="margin: 10px 0;"><i class="icon-spin5 animate-spin"></i></h3>' });
			that.getNetworkNodes()
				.pipe(
					function(data) {
						if($.isEmptyObject(data) || ($.isEmptyObject(data.apMap)  && $.isEmptyObject(data.clientMap))) {
							$.notice({
								message: $.t('msg.error_cannot_find_node'),
								type: 'error'
							});
						} else {
							that.renderNetworkNodeList(data);
						}
					},
					function(xhr, status, error) {
						var errMsg = '';
						if(xhr.status == 400) {
							errMsg = xhr.responseJSON.errMsg;
						} else {
							errMsg = $.t('msg.error_cannot_scan_node');
						}
						$.notice({
							message: errMsg,
							type: 'error'
						});
					}
				)
				.always(function() {
					$.unblockUI();
				});
		});

		$('#btn_filter', this.$el).on('click', function() {
			var $tbody = $('#network_list > tbody');
			var filter = $(this).siblings('input:text').val();
			$tbody.find('tr').hide();
			$tbody.find('td:containsIgnorecase("'+filter+'")').parent().show();
		});

		this.init();
	};

	WT.Views.FakeAp.prototype = {
		init: function() {
			this.$el = $(this.el);
			this.getNowAttack()
				.done(function(data, status, xhr) {
					if(xhr.status == 200) {
						if(data.isSelf) {
							that.renderAttackInfo(data.ap, data.client);
						} else {
							var errMsg = '';
							if(!!data.user) {
								errMsg += data.user;
							}
							errMsg += $.t('msg.error_attacking_now', {'ap': data.ap.bssid, 'client': data.client.station});
							$('.btn-scan', this.$el).off('click', function() {
								$.notice({
									message: errMsg,
									type: 'error'
								});
							});
							$.notice({
								message: errMsg,
								type: 'error'
							});
						}
					}
				})
				.fail(function() {
					that.stopAttack();
				});
		},

		initStatusData: function() {
			var sec = 10;
			var getNewStatus = function() {
				var counter = 10;
				var observer = setInterval(function() {
					if (counter > 0) {
						counter -= 1;
					}
				}, 1E3);
				that.timer = setTimeout(function() {
					clearInterval(observer);
					that.statusRetriever = WT.FakeApStatusProvider.getRetriever({
						method: 'GET',
						url: '/api/v1/network_attack_status',
						params: {}
					});
					that.statusRetriever.recall = getNewStatus;
					that.statusRetriever.doRetrieve();
				}, 10*1E3);
			}
			that.statusRetriever = WT.FakeApStatusProvider.getRetriever({
				method: 'GET',
				url: '/api/v1/network_attack_status',
				params: {}
			});
			that.statusRetriever.recall = getNewStatus;
			that.statusRetriever.doRetrieve();
		},

		stopInitStatusData: function() {
			clearTimeout(that.timer);
			//clearTimeout = 0;
			that.statusRetriever.stop();
		},

		getNowAttack: function() {
			var _dfd = $.Deferred();
			$.ajax({
				contentType: 'application/json',
				type: 'GET',
				url: '/api/v1/network_attack_now',
				dataType: 'json',
				cache: false,
				success: function(resp, status, xhr) {
					return _dfd.resolve(resp, status, xhr);
				},
				error: function(xhr, status, error) {
					return _dfd.reject(xhr, status, error);
				}
			});
			return _dfd.promise();
		},

		getNetworkNodes: function() {
			var _dfd = $.Deferred();
			$.ajax({
				contentType: 'application/json',
				type: 'GET',
				url: '/api/v1/network_nodes',
				dataType: 'json',
				cache: false,
				success: function(resp, status, xhr) {
					return _dfd.resolve(resp);
				},
				error: function(xhr, status, error) {
					return _dfd.reject(xhr, status, error);
				}
			});
			return _dfd.promise();
		},

		startAttack: function(ap, client) {
			var params = {ap: ap, client: client};
			var _dfd = $.Deferred();
			$.ajax({
				contentType: 'application/json',
				type: 'GET',
				url: '/api/v1/network_attack_on',
				dataType: 'json',
				data: params,
				cache: false,
				success: function(resp, status, xhr) {
					return _dfd.resolve(resp);
				},
				error: function(xhr, status, error) {
					return _dfd.reject(xhr, status, error);
				}
			});
			return _dfd.promise();
		},

		stopAttack: function() {
			var _dfd = $.Deferred();
			$.ajax({
				contentType: 'application/json',
				type: 'GET',
				url: '/api/v1/network_attack_off',
				dataType: 'json',
				cache: false,
				success: function(resp, status, xhr) {
					that.stopInitStatusData();
					return _dfd.resolve(resp);
				},
				error: function(xhr, status, error) {
					return _dfd.reject(xhr, status, error);
				}
			});
			return _dfd.promise();
		},
		
		renderStatusInfo: function(tasks, apMac, clientMac) {
			$('#status_info', this.$el).empty();
			for(var i in tasks) {
				if(i > 0) {
					var preTask = tasks[i - 1];
					if(!preTask.done && !!preTask.errmsg) {
						return;
					}
				}
				var task = tasks[i];
				var params = {
					ap: apMac,
					client: clientMac,
					task: task
				}
				this.appendStatusItem(params);
				if(!task.done) {
					return;
				}
			}
		},

		appendStatusItem: function(data) {
			var msg;
			if(data.task.name=='crackAP') {
				msg = $.t('fake_ap.info_msg_attack_ap');
			} else if(data.task.name=='connectAP') {
				msg = $.t('fake_ap.info_msg_connect_ap', {ap: data.ap});
			} else if(data.task.name=='getSubnetInfo') {
				msg = $.t('fake_ap.info_msg_get_network');
			} else if(data.task.name=='setupFakeAP') {
				msg = $.t('fake_ap.info_msg_setup_fake_ap');
			} else if(data.task.name=='activateAttackService') {
				msg = $.t('fake_ap.info_msg_start_up_attack');
			} else if(data.task.name=='connectTargetToFakeAP') {
				msg = $.t('fake_ap.info_msg_target_connected', {client: data.client});
			}
			data.msg = msg;
			var tpl = _.template($('#tpl_status_info_item').html());
			var $tpl = $(tpl(data));
			$tpl.i18n();
			$tpl.appendTo($('#status_info', this.$el));
		},

		renderAttackInfo: function(ap, client) {
			var data = {
				ap: ap,
				client: client
			};
			var tpl = _.template($('#tpl_attack_info').html());
			var $tpl = $(tpl(data));
			$tpl.i18n();
			$('#attack_info', this.$el).empty();
			$tpl.appendTo($('#attack_info', this.$el))
				.on('click', '.btn-unattack', function() {
					$.blockUI({ message: '<h3 style="margin: 10px 0;"><i class="icon-spin5 animate-spin"></i></h3>' });
					that.stopAttack()
						.done(function(data) {
							if(data.success) {
								$.notice({
									message: $.t('msg.success_stop_attack'),
									type: 'success'
								});
								$('#attack_info', this.$el).empty();
							} else {
								$.notice({
									message: $.t('msg.error_cannot_stop_attack_with_causes', {causes: data.errmsg}),
									type: 'error'
								});
							}
						})
						.fail(function() {
							$.notice({
								message: $.t('msg.error_cannot_stop_attack'),
								type: 'error'
							});
						})
						.always(function() {
							$.unblockUI();
						});
				});
			this.initStatusData();
		},

		renderNetworkNodeList: function(map) {
			$('#network_list > tbody', this.$el).empty();
			for(var k1 in map) {
				var isAp = 1;
				if(k1 == 'apMap') {
					isAp = 1;
					this.apMap = map[k1];
				}
				if(k1 == 'clientMap') {
					isAp = 0;
					this.clientMap = map[k1];
				}
				var subMap = map[k1];
				for(var k2 in subMap) {
					var rowData = {};
					if(isAp) {
						rowData.mac = subMap[k2].bssid;
						rowData.type = 'AP';
						rowData.name = subMap[k2].essid;
						rowData.isFakeAP = subMap[k2].isFakeAP;
						rowData.hasConnected = 0;
					} else {
						rowData.mac = subMap[k2].station;
						rowData.type = 'Client';
						rowData.name = subMap[k2].bssid;
						rowData.isFakeAP = 0;
						if(!!subMap[k2].bssid && typeof this.apMap[subMap[k2].bssid] !== 'undefined' && this.apMap[subMap[k2].bssid].isFakeAP) {
							rowData.hasConnected = 1;
						} else {
							rowData.hasConnected = 0;
						}
					}
					this.appendNetworkNode(rowData);
				}
			}
		},

		appendNetworkNode: function(data) {
			var tpl = _.template($('#tpl_networknode_table_row').html());
			var $tpl = $(tpl(data));
			$tpl.i18n();
			if(data.isFakeAP) {
				$tpl.css({background: '#000000', color: '#FFFFFF'});
			}
			if(data.hasConnected) {
				$tpl.css({background: '#CCCCCC'});
			}
			$tpl.appendTo($('#network_list', this.$el))
				.on('click', function(e) {
					e.preventDefault();
					e.stopPropagation();
					var mac = $('td:first > :hidden', $tpl).val();
					var type = $('td:nth-child(2)', $tpl).text();
					that.openDetailDialog(mac, type.toLowerCase());
				});
		},

		openDetailDialog: function(mac, type) {
			if(type == 'ap') {
				this.openApDetailDialog(mac);
			} else {
				this.openClientDetailDialog(mac);
			}
		},

		openApDetailDialog: function(mac) {
			var data = this.apMap[mac];

			var tpl = _.template($('#tpl_dialog_ap_node_detail').html());
			var $tpl = $(tpl(data));
			$tpl.i18n();
			
			var dl = $tpl.dialog({
				minHeight: 260,
				minWidth: 420,
				modal: true,
				resizable: false,
				title: $.t('fake_ap.node_info_dialog_title', {'mac': mac}),
				close: function(event, ui) {
					dl.dialog('destroy');
				}
			}).on('click', '#btn_attack', function() {
				var ap = $('#ap', $tpl).val();
				var client = $(':radio:checked', $tpl).val();
				if(!!client) {
					$.blockUI({ message: '<h3 style="margin: 10px 0;"><i class="icon-spin5 animate-spin"></i></h3>' });
					that.startAttack(ap, client)
						.done(function(data) {
							$.notice({
								message: $.t('msg.success_attack'),
								type: 'success'
							});
							that.renderAttackInfo(that.apMap[ap], that.clientMap[client]);
							dl.dialog('close');
						})
						.fail(function(xhr, status, error) {
							var errMsg;
							if(xhr.status == 400) {
								errMsg = xhr.responseJSON.errMsg;
							} else {
								errMsg = $.t('msg.error_cannot_attack');
							}
							$.notice({
								message: errMsg,
								type: 'error'
							});
						})
						.always(function() {
							$.unblockUI();
						});
				} else {
					$.notice({
						message: $.t('msg.error_select_client'),
						type: 'error'
					});
				}
			});
		},

		openClientDetailDialog: function(mac) {
			var data = {client: this.clientMap[mac], ap: this.apMap[this.clientMap[mac].bssid]};

			var tpl = _.template($('#tpl_dialog_client_node_detail').html());
			var $tpl = $(tpl(data));
			$tpl.i18n();
			
			var dl = $tpl.dialog({
				minHeight: 260,
				minWidth: 420,
				modal: true,
				resizable: false,
				title: $.t('fake_ap.node_info_dialog_title', {'mac': mac}),
				close: function(event, ui) {
					dl.dialog('destroy');
				}
			}).on('click', '#btn_attack', function() {
				var ap = $('#ap', $tpl).val();
				var client = $('#client', $tpl).val();
				$.blockUI({ message: '<h3 style="margin: 10px 0;"><i class="icon-spin5 animate-spin"></i></h3>' });
				that.startAttack(ap, client)
					.done(function(data) {
						$.notice({
							message: $.t('msg.success_attack'),
							type: 'success'
						});
						that.renderAttackInfo(that.apMap[ap], that.clientMap[client]);
						dl.dialog('close');
					})
					.fail(function(xhr, status, error) {
						var errMsg;
						if(xhr.status == 400) {
							errMsg = xhr.responseJSON.errMsg;
						} else {
							errMsg = $.t('msg.error_cannot_attack');
						}
						$.notice({
							message: errMsg,
							type: 'error'
						});
					})
					.always(function() {
						$.unblockUI();
					});
			});
		}
	};
}(WT);
/**********
 * FreeAp
 **********/
! function(WT) {
	WT.PollingProvider = function() {
		var getRetriever = function(options) {
			var that;
			var DataRetriever = function(_options) {
				that = this;
				//this._dfd = $.Deferred();
				this.options = $.extend({}, this._defaults, _options);
			};
			DataRetriever.prototype = {
				_defaults: {},
				doRetrieve: function() {
					this.ajXHR = $.ajax({
						contentType: 'application/json',
						type: this.options.method,
						url: this.options.url,
						dataType: 'json',
						async: false,
						data: this.options.params,
						cache: false
					}).done(function(data, status, xhr) {
						that.feed.call(that, data);
						// that._dfd.done(function() {
						// 	console.log('==================================================>');
							if(that.recall) that.recall.call(that);
						// });
					}).fail(function(xhr, status, error) {
						if(that.recall) that.recall.call(that);
						//that._dfd.reject(xhr);
					});
				},
				feed: function(data) {},
				recall: function(callback) {},
				stop: function() {
					console.log(this.ajXHR);
					if(!!this.ajXHR) {
						this.ajXHR.abort();
					}
					//that._dfd.reject();
				}
			};

			return new DataRetriever(options);
		};

		return {
			getRetriever: getRetriever
		};
	}();
}(WT);
! function(WT) {
	var that;
	WT.Views = WT.Views || {};
	WT.Views.FreeAP = function(el) {
		that = this;
		
		this.el = el;
		this.init();

		$('.btn_create_free_ap', this.$el).on('click', function() {
			that.startupFreeAP()
				.done(function(data) {
					that.initApPollingRetriever();
					that.initClientPollingRetriever();
					that.queryFreeApStatus()
						.done(function(data) {
							if(data.length == 0) {
								$.notice({
									message: $.t('msg.sys_err_conn_adm_info'),
									type: 'error'
								});
							} else {
								$.notice({
									message: $.t('msg.success_activate_ap'),
									type: 'success'
								});
								that.switchFreeApBtn(data);
							}
						})
						.fail(function() {
							$.notice({
								message: $.t('msg.sys_err_conn_adm_info'),
								type: 'error'
							});
						});
				})
				.fail(function (xhr, status, error) {
					$.notice({
						message: $.t('msg.sys_err_conn_adm_info'),
						type: 'error'
					});
				});
		});

		$('.btn_shutdown_ap', this.$el).on('click', function() {
			that.shutdownFreeAP()
				.done(function(data) {
					that.stopApPollingRetriever();
					that.stopClientPollingRetriever();
					that.queryFreeApStatus()
						.done(function(data) {
							if(data.length == 0) {
								$.notice({
									message: $.t('msg.sys_err_conn_adm_info'),
									type: 'error'
								});
							} else {
								$.notice({
									message: $.t('msg.success_inactivate_ap'),
									type: 'success'
								});
								that.switchFreeApBtn(data);
							}
						})
						.fail(function() {
							$.notice({
								message: $.t('msg.sys_err_conn_adm_info'),
								type: 'error'
							});
						});
				})
				.fail(function (xhr, status, error) {
					$.notice({
						message: 'Error!!!',
						type: 'error'
					});
				});
		});
	};

	WT.Views.FreeAP.prototype = {
		init: function() {
			this.$el = $(this.el);
			that.queryFreeApStatus()
				.done(function(data) {
					if(typeof data === 'undefined') {
						$.notice({
							message: $.t('msg.sys_err_conn_adm_info'),
							type: 'error'
						});
					} else {
						that.switchFreeApBtn(data);
						if(data.enabled == 1) {
							that.initApPollingRetriever();
							that.initClientPollingRetriever();
						}
					}
				})
				.fail(function() {
					$.notice({
						message: $.t('msg.sys_err_conn_adm_info'),
						type: 'error'
					});
				});
		},

		startupFreeAP: function() {
			var _dfd = $.Deferred();
			$.ajax({
				contentType: 'application/json',
				type: 'GET',
				url: '/api/v1/free_ap/startup',
				dataType: 'json',
				cache: false,
				success: function(resp, status, xhr) {
					return _dfd.resolve(resp);
				},
				error: function(xhr, status, error) {
					return _dfd.reject(xhr, status, error);
				}
			});
			return _dfd.promise();
		},

		shutdownFreeAP: function() {
			var _dfd = $.Deferred();
			$.ajax({
				contentType: 'application/json',
				type: 'GET',
				url: '/api/v1/free_ap/shutdown',
				dataType: 'json',
				cache: false,
				success: function(resp, status, xhr) {
					return _dfd.resolve(resp);
				},
				error: function(xhr, status, error) {
					return _dfd.reject(xhr, status, error);
				}
			});
			return _dfd.promise();
		},

		initApPollingRetriever: function() {
			var feedData = function(data) {
				//console.log('===== feed =====');
				//console.log(data);
				that.switchFreeApBtn(data);
				//return this._dfd.promise();
			};

			var getNewData = function() {
				//console.log('===== recall =====');
				var counter = 10;
				var observer = setInterval(function() {
					if (counter > 0) {
						//console.log('ap: ' + counter);
						counter -= 1;
					}
				}, 1E3);
				that.apTimer = setTimeout(function() {
					clearInterval(observer);
					that.apPollingRetriever = WT.PollingProvider.getRetriever({
						method: 'GET',
						url: '/api/v1/free_ap/status',
						params: {}
					});
					that.apPollingRetriever.feed = feedData;
					that.apPollingRetriever.recall = getNewData;
					that.apPollingRetriever.doRetrieve();
				}, 10*1E3);
			}
			this.apPollingRetriever = WT.PollingProvider.getRetriever({
				method: 'GET',
				url: '/api/v1/free_ap/status',
				params: {}
			});
			this.apPollingRetriever.feed = feedData;
			this.apPollingRetriever.recall = getNewData;
			this.apPollingRetriever.doRetrieve();
		},

		initClientPollingRetriever: function() {
			var feedData = function(data) {
				//console.log('===== feed =====');
				that.renderClientList(data);
				//return this._dfd.promise();
			};

			var getNewData = function() {
				//console.log('===== recall =====');
				var counter = 10;
				var observer = setInterval(function() {
					if (counter > 0) {
						//console.log('cl: ' + counter);
						counter -= 1;
					}
				}, 1E3);
				that.clTimer = setTimeout(function() {
					clearInterval(observer);
					that.clPollingRetriever = WT.PollingProvider.getRetriever({
						method: 'GET',
						url: '/api/v1/free_ap/connections',
						params: {}
					});
					that.clPollingRetriever.feed = feedData;
					that.clPollingRetriever.recall = getNewData;
					that.clPollingRetriever.doRetrieve();
				}, 10*1E3);
			}

			this.clPollingRetriever = WT.PollingProvider.getRetriever({
				method: 'GET',
				url: '/api/v1/free_ap/connections',
				params: {}
			});
			this.clPollingRetriever.feed = feedData;
			this.clPollingRetriever.recall = getNewData;
			this.clPollingRetriever.doRetrieve();
		},

		queryFreeApStatus: function() {
			var _dfd = $.Deferred();
			$.ajax({
				contentType: 'application/json',
				type: 'GET',
				url: '/api/v1/free_ap/status',
				dataType: 'json',
				cache: false,
				success: function(resp, status, xhr) {
					return _dfd.resolve(resp);
				},
				error: function(xhr, status, error) {
					return _dfd.reject(xhr, status, error);
				}
			});
			return _dfd.promise();
		},

		stopApPollingRetriever: function() {
			clearTimeout(that.apTimer);
			if(this.apPollingRetriever)
				this.apPollingRetriever.stop();
		},

		stopClientPollingRetriever: function() {
			clearTimeout(that.clTimer);
			if(this.clPollingRetriever)
				this.clPollingRetriever.stop();
		},

		switchFreeApBtn: function(data) {
			if(data.enabled == 1) {
				$('.btn_shutdown_ap', this.$el)
					.css({'display': 'inline'})
					.siblings('.btn_create_free_ap')
					.css({'display': 'none'});
			} else {
				$('.btn_shutdown_ap', this.$el)
					.css({'display': 'none'})
					.siblings('.btn_create_free_ap')
					.css({'display': 'inline'});
			}
		},

		renderClientList: function(data) {
			$.blockUI({ message: '<h3 style="margin: 10px 0;"><i class="icon-spin5 animate-spin"></i></h3>' });
			$('#client_list > tbody', this.$el).empty();
			for(var i in data) {
				this.appendClientRow(data[i]);
			}
			$.unblockUI();
		},

		appendClientRow: function(client) {
			var tpl = _.template($('#tpl_client_row').html());
			var $tpl = $(tpl(client));
			$tpl.i18n();
			$tpl.appendTo($('#client_list > tbody', this.$el));
		}
	};
}(WT);
/**********
 * PhishingSite
 **********/
! function(WT) {
	var that;
	WT.Views = WT.Views || {};
	WT.Views.PhishingSite = function(el) {
		that = this;
		
		this.el = el;
		this.init();
	};

	WT.Views.PhishingSite.prototype = {
		init: function() {
			this.$el = $(this.el);
			/*this.getPhishingSites()
				.pipe(
					function(data) {
						that.renderPhishingSiteList(data);
					},
					function (xhr, status, error) {
						$.notice({
							message: $.t('msg.error_cannot_get_phishing_site'),
							type: 'error'
						});
					}
				);*/
			this.initPollingRetriever();
		},

		initPollingRetriever: function() {
			var feedData = function(data) {
				console.log('===== feed =====');
				//console.log(data);
				that.renderPhishingSiteList(data);
				//return this._dfd.promise();
			};

			var getNewData = function() {
				console.log('===== recall =====');
				var counter = 10;
				var observer = setInterval(function() {
					if (counter > 0) {
						//console.log(counter);
						counter -= 1;
					}
				}, 1E3);
				that.timer = setTimeout(function() {
					clearInterval(observer);
					that.pollingRetriever = WT.PollingProvider.getRetriever({
						method: 'GET',
						url: '/api/v1/phishing_sites',
						params: {}
					});
					that.pollingRetriever.feed = feedData;
					that.pollingRetriever.recall = getNewData;
					that.pollingRetriever.doRetrieve();
				}, 10*1E3);
			}
			this.pollingRetriever = WT.PollingProvider.getRetriever({
				method: 'GET',
				url: '/api/v1/phishing_sites',
				params: {}
			});
			this.pollingRetriever.feed = feedData;
			this.pollingRetriever.recall = getNewData;
			this.pollingRetriever.doRetrieve();
		},

		getPhishingSites: function() {
			var _dfd = $.Deferred();
			$.ajax({
				contentType: 'application/json',
				type: 'GET',
				url: '/api/v1/phishing_sites',
				dataType: 'json',
				cache: false,
				success: function(resp, status, xhr) {
					return _dfd.resolve(resp);
				},
				error: function(xhr, status, error) {
					return _dfd.reject(xhr, status, error);
				}
			});
			return _dfd.promise();
		},

		getPhishingAccounts: function(siteKey) {
			var _dfd = $.Deferred();
			if(typeof siteKey === 'undefined' || siteKey == null || !siteKey.length) {
				return _dfd.reject('Site Key is undefined.');
			}
			$.ajax({
				contentType: 'application/json',
				type: 'GET',
				url: '/api/v1/phishing_sites/' + siteKey + '/accounts',
				dataType: 'json',
				cache: false,
				success: function(resp, status, xhr) {
					return _dfd.resolve(resp);
				},
				error: function(xhr, status, error) {
					return _dfd.reject(xhr, status, error);
				}
			});
			return _dfd.promise();
		},

		renderPhishingSiteList: function(sites) {
			//console.log(sites);
			$.blockUI({ message: '<h3 style="margin: 10px 0;"><i class="icon-spin5 animate-spin"></i></h3>' });
			$('#phishing_site_list > tbody', this.$el).empty();
			for(var i in sites) {
				this.appendSiteRow(sites[i]);
			}
			$.unblockUI();
		},

		refreshPhishingSiteList: function() {
			this.getPhishingSites()
				.pipe(
					function(data) {
						that.renderPhishingSiteList(data);
					},
					function (xhr, status, error) {
						$.notice({
							message: $.t('msg.error_cannot_get_phishing_site'),
							type: 'error'
						});
					}
				);
		},

		startupRule: function(siteKey) {
			var _dfd = $.Deferred();
			if(typeof siteKey === 'undefined' || siteKey == null || !siteKey.length) {
				return _dfd.reject('Site Key is undefined.');
			}
			$.ajax({
				contentType: 'application/json',
				type: 'GET',
				url: '/api/v1/phishing_sites/' + siteKey + '/startupRule',
				dataType: 'json',
				cache: false,
				success: function(resp, status, xhr) {
					return _dfd.resolve(resp);
				},
				error: function(xhr, status, error) {
					return _dfd.reject(xhr, status, error);
				}
			});
			return _dfd.promise();
		},

		shutdownRule: function(siteKey) {
			var _dfd = $.Deferred();
			if(typeof siteKey === 'undefined' || siteKey == null || !siteKey.length) {
				return _dfd.reject('Site Key is undefined.');
			}
			$.ajax({
				contentType: 'application/json',
				type: 'GET',
				url: '/api/v1/phishing_sites/' + siteKey + '/shutdownWebsiteRule',
				dataType: 'json',
				cache: false,
				success: function(resp, status, xhr) {
					return _dfd.resolve(resp);
				},
				error: function(xhr, status, error) {
					return _dfd.reject(xhr, status, error);
				}
			});
			return _dfd.promise();
		},

		appendSiteRow: function(site) {
			var tpl = _.template($('#tpl_phishing_site_row').html());
			var $tpl = $(tpl(site));
			$tpl.i18n();
			$tpl.appendTo($('#phishing_site_list > tbody', this.$el))
				.on('click', '.btn-startup', function() {
					var key = $(this).siblings('#key:hidden').val();
					that.startupRule(key)
						.done(function(data) {
							that.refreshPhishingSiteList();
							$.notice({
								message: $.t('msg.success_enable_rule'),
								type: 'success'
							});
						})
						.fail(function() {
							$.notice({
								message: $.t('msg.error_enable_rule'),
								type: 'error'
							});
						});
				})
				.on('click', '.btn-shutdown', function() {
					var key = $(this).siblings('#key:hidden').val();
					that.shutdownRule(key)
						.done(function(data) {
							that.refreshPhishingSiteList();
							$.notice({
								message: $.t('msg.success_disable_rule'),
								type: 'success'
							});
						})
						.fail(function() {
							$.notice({
								message: $.t('msg.error_disable_rule'),
								type: 'error'
							});
						});
				})
				.on('click', '.btn-searchAccount', function() {
					var key = $(this).siblings('#key:hidden').val();
					var name = $(this).siblings('#name:hidden').val();
					$('#phishing_account_card > .card-hd > h4', this.$el).text($.t('phishing_web_site.accountList_card_titla', {siteName: name}));
					that.getPhishingAccounts(key)
						.done(function(data) {
							$('#phishing_account_list > tbody', this.$el).empty();
							if(data.length == 0) {
								$.notice({
									message: $.t('msg.error_no_data'),
									type: 'error'
								});
							} else {
								that.renderPhishingAccountList(data);
							}
						})
						.fail(function() {
							$.notice({
								message: $.t('msg.error_cannot_get_phishing_data'),
								type: 'error'
							});
						});
				});
		},

		renderPhishingAccountList: function(phishingAccounts) {
			$.blockUI({ message: '<h3 style="margin: 10px 0;"><i class="icon-spin5 animate-spin"></i></h3>' });
			for(var i in phishingAccounts) {
				this.appendAccountRow(phishingAccounts[i]);
			}
			$.unblockUI();
		},

		appendAccountRow: function(phishingAccount) {
			var tpl = _.template($('#tpl_phishing_account_row').html());
			var $tpl = $(tpl(phishingAccount));
			$tpl.i18n();
			$tpl.appendTo($('#phishing_account_list > tbody', this.$el));
		}
	};
}(WT);
/**********
 * PhishingAccount
 **********/
! function(WT) {
	var that;
	WT.Views = WT.Views || {};
	WT.Views.PhishingAccounts = function(el) {
		that = this;
		
		this.el = el;
		this.init();

		// Event
		$('.btn_search', this.$el).on('click', function() {
			var site_key = $('#select_phishing_site', that.$el).val();
			that.getPhishingAccounts(site_key)
				.done(function(data) {
					if(data.length == 0) {
						$.notice({
							message: $.t('msg.error_no_data'),
							type: 'error'
						});
					} else {
						that.renderPhishingAccountList(data);
					}
				})
				.fail(function () {
					$.notice({
						message: $.t('msg.error_cannot_get_phishing_data'),
						type: 'error'
					});
				});
		});
	};

	WT.Views.PhishingAccounts.prototype = {
		init: function() {
			this.$el = $(this.el);
			this.getPhishingSites()
				.pipe(
					function(data) {
						that.renderSelectPhishingSite(data);
						var site_key = $('#select_phishing_site', this.$el).val();
						if(!!site_key) {
							return that.getPhishingAccounts(site_key);
						} else {
							return null;
						}
					},
					function (xhr, status, error) {
						$.notice({
							message: $.t('msg.error_cannot_get_phishing_site'),
							type: 'error'
						});
					}
				)
				.pipe(
					function(data) {
						if(data.length == 0) {
							$.notice({
								message: $.t('msg.error_no_data'),
								type: 'error'
							});
						} else {
							that.renderPhishingAccountList(data);
						}
					},
					function (xhr, status, error) {
						$.notice({
							message: $.t('msg.error_cannot_get_phishing_data'),
							type: 'error'
						});
					}
				);
		},

		getPhishingSites: function() {
			var _dfd = $.Deferred();
			$.ajax({
				contentType: 'application/json',
				type: 'GET',
				url: '/api/v1/phishing_sites',
				dataType: 'json',
				cache: false,
				success: function(resp, status, xhr) {
					return _dfd.resolve(resp);
				},
				error: function(xhr, status, error) {
					return _dfd.reject(xhr, status, error);
				}
			});
			return _dfd.promise();
		},

		getPhishingAccounts: function(siteKey) {
			var _dfd = $.Deferred();
			if(typeof siteKey === 'undefined' || siteKey == null || !siteKey.length) {
				return _dfd.reject('Site Key is undefined.');
			}
			$.ajax({
				contentType: 'application/json',
				type: 'GET',
				url: '/api/v1/phishing_sites/' + siteKey + '/accounts',
				dataType: 'json',
				cache: false,
				success: function(resp, status, xhr) {
					return _dfd.resolve(resp);
				},
				error: function(xhr, status, error) {
					return _dfd.reject(xhr, status, error);
				}
			});
			return _dfd.promise();
		},

		renderSelectPhishingSite: function(phishingSites) {
			var $tar = $('#select_phishing_site', this.$el).empty();
			if(!phishingSites.length) {
				$.notice({
					message: $.t('msg.error_no_phishing_site'),
					type: 'error'
				});
			}
			for(var i in phishingSites) {
				var phishingSite = phishingSites[i];
				$('<option>').val(phishingSite.site_key).text(phishingSite.name).appendTo($tar);
			}
		},

		renderPhishingAccountList: function(phishingAccounts) {
			$.blockUI({ message: '<h3 style="margin: 10px 0;"><i class="icon-spin5 animate-spin"></i></h3>' });
			$('#phishing_account_list > tbody', this.$el).empty();
			for(var i in phishingAccounts) {
				this.appendRow(phishingAccounts[i]);
			}
			$.unblockUI();
		},

		appendRow: function(phishingAccount) {
			var tpl = _.template($('#tpl_table_row').html());
			var $tpl = $(tpl(phishingAccount));
			$tpl.appendTo($('#phishing_account_list > tbody', this.$el));
		}
	};
}(WT);
/**********
 * Messaging
 **********/
! function(WT) {
	var that;
	WT.Views = WT.Views || {};
	WT.Views.Messaging = function(el) {
		that = this;
		
		this.el = el;
		this.init();

		// Event
		$('#target', this.$el).on('change', function() {
			var targetId = $(this).val();
			that.getTargetApps(targetId)
				.done(that.renderSelectTargetApp)
				.fail(function() {
					$.notice({
						message: $.t('msg.error_cannot_get_target_app'),
						type: 'error'
					});
				});
		});

		$('#btn_search', this.$el).on('click', function() {
			$('.chatlist', this.$el).empty();
			$('.chatroom > .target-talk, .chatroom > .party-talk', this.$el).remove();
			var targetId = $('#target', this.$el).val(),
				app      = $('#app', this.$el).val();
			if(!targetId) {
				$.notice({
					message: $.t('msg.error_select_target'),
					type: 'error'
				});
			}
			if(!app) {
				var inner = $('#app', this.$el).html();
				var msg;
				if(!!inner) {
					msg = $.t('msg.error_select_target_app');
				} else {
					msg = $.t('msg.error_no_app_for_target');
				}
				$.notice({
					message: msg,
					type: 'error'
				});
			}
			if(!!targetId && !!app) {
				that.getChats()
					.done(function(data) {
						that.renderChatlist(data);
					})
					.fail(function() {
						$.notice({
							message: $.t('msg.error_cannot_get_chatlist'),
							type: 'error'
						});
					});
			}
		});

		$('#load_more', this.$el).on('click', function() {
			var $crt = $('.chatitem.current', that.$el)
			if(!$crt.length) {
				$.notice({
					message: $.t('msg.error_select_chat'),
					type: 'error'
				});
				return;
			}
			var chatId = $(':hidden', $crt).val();
			var lt = $('.talk-time:last > :hidden', that.$el).val();
			that.appendNewMessages(chatId, lt);
		});

		$('.go-top', this.$el).on('click', function() {
			$('.sub-main-wrap', that.$el).animate({ scrollTop: 0}, '500');
		});
	};

	WT.Views.Messaging.prototype = {
		init: function() {
			this.$el = $(this.el);
			$.blockUI({ message: '<h3 style="margin: 10px 0;"><i class="icon-spin5 animate-spin"></i></h3>' });
			this.getUserTargets()
				.pipe(
					function(data) {
						that.renderSelectUserTargets(data);
						var targetId = $('#target', this.$el).val();
						if(!!targetId) {
							return that.getTargetApps(targetId);
						} else {
							return null;
						}
					},
					function (xhr, status, error) {
						$.notice({
							message: $.t('msg.error_cannot_get_user_target'),
							type: 'error'
						});
					}
				)
				.pipe(
					function(data) {
						if(!!data) {
							that.renderSelectTargetApp(data);
							return that.getChats();
						} else {
							return null;
						}
					},
					function (xhr, status, error) {
						$.notice({
							message: $.t('msg.error_cannot_get_target_app'),
							type: 'error'
						});
					}
				)
				.pipe(
					function(data) {
						if(!!data) {
							that.renderChatlist(data);
						}
					},
					function (xhr, status, error) {
						$.notice({
							message: $.t('msg.error_cannot_get_chatlist'),
							type: 'error'
						});
					}
				).always(function() {
					$.unblockUI();
				});
		},

		getUserTargets: function() {
			var _dfd = $.Deferred();
			$.ajax({
				contentType: 'application/json',
				type: 'GET',
				url: '/api/v1/user_targets',
				dataType: 'json',
				cache: false,
				success: function(resp, status, xhr) {
					return _dfd.resolve(resp);
				},
				error: function(xhr, status, error) {
					return _dfd.reject(xhr, status, error);
				}
			});
			return _dfd.promise();
		},

		getTargetApps: function(targetId) {
			var _dfd = $.Deferred();
			$.ajax({
				contentType: 'application/json',
				type: 'GET',
				url: '/api/v1/targets/' + targetId + '/apps',
				dataType: 'json',
				cache: false,
				success: function(resp, status, xhr) {
					return _dfd.resolve(resp);
				},
				error: function(xhr, status, error) {
					return _dfd.reject(xhr, status, error);
				}
			});
			return _dfd.promise();
		},

		getChats: function() {
			var _dfd = $.Deferred();
			var param = {
				targetId: $('#target', this.$el).val(),
				app:      $('#app', this.$el).val()
			};
			if(!!param.targetId && !!param.app) {
				$.ajax({
					contentType: 'application/json',
					type: 'GET',
					url: '/api/v1/chats',
					dataType: 'json',
					data: param,
					cache: false,
					success: function(resp, status, xhr) {
						return _dfd.resolve(resp);
					},
					error: function(xhr, status, error) {
						return _dfd.reject(xhr, status, error);
					}
				});
			} else {
				return _dfd.resolve(null);
			}
			return _dfd.promise();
		},

		getMessages: function(chatId, lt) {
			var _dfd = $.Deferred();
			var param = {};
			param.chatId = chatId;
			param.lt = lt;
			$.ajax({
				contentType: 'application/json',
				type: 'GET',
				url: '/api/v1/chat/messages',
				dataType: 'json',
				data: param,
				cache: false,
				success: function(resp, status, xhr) {
					return _dfd.resolve(resp);
				},
				error: function(xhr, status, error) {
					return _dfd.reject(xhr, status, error);
				}
			});
			return _dfd.promise();
		},

		renderSelectUserTargets: function(targets) {
			var $tar = $('#target', this.$el).empty();
			if(!targets.length) {
				$.notice({
					message: $.t('msg.errot_you_donot_have_target'),
					type: 'error'
				});
			}
			for(var i in targets) {
				var target = targets[i];
				$('<option>').val(target.target_id).text(target.target_phone).appendTo($tar);
			}
		},

		renderSelectTargetApp: function(apps) {
			var $tar = $('#app', this.$el).empty();
			//$('.chatlist', this.$el).empty();
			//$('.chatroom > .target-talk, .chatroom > .party-talk', this.$el).remove();
			if(!apps.length) {
				$.notice({
					message: $.t('msg.error_no_app_for_target'),
					type: 'error'
				});
			}
			for(var i in apps) {
				var app = apps[i];
				$('<option>').val(app.app_name).text(app.app_name).appendTo($tar);
			}
		},

		renderChatlist: function(data) {
			$('.chatlist', this.$el).empty();
			_.each(data, function(item) {
				that.appendChatitem(item);
			});
		},

		appendChatitem: function(data) {
			var tpl = _.template($('#tpl_chat_chatitem').html());
			var $tpl = $(tpl(data));
			$tpl.i18n();
			$tpl.appendTo($('.chatlist', this.$el))
				.on('click', 'a', function() {
					var $this = $(this);
					var chatId = $this.siblings(':hidden').val();
					$this.parent().addClass('current').siblings('.current').removeClass();
					that.renderMessages(chatId);
				});
		},

		renderMessages: function(chatId) {
			$.blockUI({ message: '<h3 style="margin: 10px 0;"><i class="icon-spin5 animate-spin"></i></h3>' });
			$('.chatroom > .target-talk, .chatroom > .party-talk', this.$el).remove();
			this.getMessages(chatId)
				.done(function(data) {
					_.each(data, function(message) {
						that.appendMessage(message);
					});
				})
				.fail(function() {
					$.notice({
						message: $.t('msg.error_cannot_get_messages'),
						type: 'error'
					});
				})
				.always(function() {
					$('.sub-main-wrap', that.$el).animate({ scrollTop: $('.chat-card', that.$el).outerHeight()}, '500');
					$.unblockUI();
				});
		},

		appendMessage: function(data) {
			var target_name = $('#target > option:selected', this.$el).text();
			data.target_name = target_name;
			var tpl = _.template($('#tpl_chat_message').html());
			var $tpl = $(tpl(data));
			$tpl.i18n();
			$tpl.insertBefore($('.load-more', this.$el))
			$('.show_img', $tpl).fancybox({
				helpers: {
					title : {
						type : 'outside'
					},
					overlay : {
						speedOut : 0
					}
				}
			});
		},

		appendNewMessages: function(chatId, lt) {
			$.blockUI({ message: '<h3 style="margin: 10px 0;"><i class="icon-spin5 animate-spin"></i></h3>' });
			this.getMessages(chatId, lt)
				.done(function(data) {
					console.log(data);
					_.each(data, function(message) {
						that.appendMessage(message);
					});
				})
				.fail(function() {
					$.notice({
						message: $.t('msg.error_cannot_get_messages'),
						type: 'error'
					});
				})
				.always(function() {
					$.unblockUI();
				});
		}
	};
}(WT);
/**********
 * Packet Summary
 **********/
! function(WT) {
	var that;
	WT.Views = WT.Views || {};
	WT.Views.PktSummary = function(el) {
		that = this;
		
		this.el = el;
		this.init();

		$('#btn_cleanDB', this.$el).on('click', this.openDeleteDialog);

		$('#btn_loadData', this.$el).on('click', function() {
			$.blockUI({ message: '<h3 style="margin: 10px 0;"><i class="icon-spin5 animate-spin"></i></h3>' });
			that.getSummaryData()
				.pipe(
					function(data) {
						that.renderDataSQ(data);
					},
					function(xhr, status, error) {
						$.notice({
							message: $.t('msg.error_cannot_get_data'),
							type: 'error'
						});
					}
				).always(function() {
					$.unblockUI();
				});
		});

		$('#btn_filter', this.$el).on('click', function() {
			var $card = $('.card');
			var filter = $(this).siblings('input:text').val();
			$card.hide();
			$card.find('.card-hd > h4:contains("'+filter+'")').parents('.card').show();
		});

		$('.go-top', this.$el).on('click', function() {
			$('#pktSummaryBd', that.$el).animate({ scrollTop: 0}, '500');
		});
	};

	WT.Views.PktSummary.prototype = {
		init: function() {
			this.$el = $(this.el);
			$.blockUI({ message: '<h3 style="margin: 10px 0;"><i class="icon-spin5 animate-spin"></i></h3>' });
			this.getSummaryTypes()
				.pipe(
					function(data) {
						that.logTypeMpa(data);
						that.renderBtnGroup(data);
						return that.getSummaryData();
					},
					function(xhr, status, error) {
						$.notice({
							message: $.t('msg.error_cannot_get_summary_types'),
							type: 'error'
						});
					}
				)
				.pipe(
					function(data) {
						that.renderDataSQ(data);
					},
					function(xhr, status, error) {
						$.notice({
							message: $.t('msg.error_cannot_get_data'),
							type: 'error'
						});
					}
				).always(function() {
					$.unblockUI();
				});
		},

		logTypeMpa: function(data) {
			var typeMap = {};
			for(var i in data) {
				var type = data[i];
				typeMap[type.type] = type.name;
			}
			this.typeMap = typeMap;
		},

		getSummaryTypes: function() {
			var _dfd = $.Deferred();
			$.ajax({
				contentType: 'application/json',
				type: 'GET',
				url: '/api/v1/pkt-summary/types',
				dataType: 'json',
				cache: false,
				success: function(resp, status, xhr) {
					return _dfd.resolve(resp);
				},
				error: function(xhr, status, error) {
					return _dfd.reject(xhr, status, error);
				}
			});
			return _dfd.promise();
		},

		getSummaryData: function() {
			var _dfd = $.Deferred();
			$.ajax({
				contentType: 'application/json',
				type: 'GET',
				url: '/api/v1/pkt-summary/data',
				dataType: 'json',
				cache: false,
				success: function(resp, status, xhr) {
					return _dfd.resolve(resp);
				},
				error: function(xhr, status, error) {
					return _dfd.reject(xhr, status, error);
				}
			});
			return _dfd.promise();
		},

		deleteSummaryData: function() {
			var _dfd = $.Deferred();
			$.ajax({
				contentType: 'application/json',
				type: 'DELETE',
				url: '/api/v1/pkt-summary/data',
				dataType: 'json',
				cache: false,
				success: function(resp, status, xhr) {
					return _dfd.resolve();
				},
				error: function(xhr, status, error) {
					return _dfd.reject();
				}
			});
			return _dfd.promise();
		},

		renderBtnGroup: function(data) {
			var $tar = $('#types_btn_gp', this.$el).empty();
			for(var i in data) {
				var type = data[i];
				$('<a>').addClass('g-btn b-g-on')
						.attr({
							id: 'gBtn_' + type.type,
							href: 'javascript:;'
						})
						.text($.t(type.name))
						.on('click', this.switchTypeBtn)
						.appendTo($tar);
				if(i < (data.length - 1)) {
					$('<span class="g-separator"></span>').appendTo($tar);
				}
			}
		},

		renderDataSQ: function(data) {
			if($.isEmptyObject(data)) {
				$.notice({
					message: $.t('msg.error_no_data'),
					type: 'error'
				});
			}
			$('#data_sq', this.$el).empty();
			for(var ipv4 in data) {
				this.appendDataCard(ipv4, data[ipv4]);
			}
		},

		appendDataCard: function(ipv4, data) {
			var params = {
				ipv4: ipv4
			};
			var tpl = _.template($('#tpl_data_card').html());
			var $tpl = $(tpl(params));
			$tpl.i18n();
			for(var type in data) {
				var $li = this.renderDataCardItem(type, data[type]);
				$li.appendTo($('ul.list', $tpl));
			}
			$tpl.appendTo($('#data_sq', this.$el));
		},

		renderDataCardItem: function(type, data) {
			var params = {
				type: type,
				typeName: this.typeMap[type],
				data: data
			};
			var tpl = _.template($('#tpl_data_card_item').html());
			var $tpl = $(tpl(params));
			$tpl.i18n();
			var $li = $('<li>').addClass('col m-b-40').append($tpl);
			return $li;
		},

		openConfirmDialog: function(options, callback) {
			var tpl = _.template($('#tpl_dialog_confirm_form').html());
			var $tpl = $(tpl({message: options.message}));
			$tpl.i18n();
			var dl = $tpl.dialog({
				minHeight: 160,
				minWidth: 320,
				modal: true,
				resizable: false,
				title: options.title,
				close: function(event, ui) {
					dl.dialog('destroy');
				}
			}).on('click', '#btn_cancel', function() {
				callback(false);
				dl.dialog('close');
			}).on('click', '#btn_submit', function() {
				callback(true);
				dl.dialog('close');
			});
		},

		openDeleteDialog: function() {
			var options = {
				title: $.t('summary.clean_db_dialog_title'),
				message: $.t('summary.msg_clean_db_info')
			};
			that.openConfirmDialog(options, function(flg) {
				if(flg) {
					that.deleteSummaryData()
						.pipe(
							function() {
								return that.getSummaryData();
							},
							function() {
								$.notice({
									message: $.t('msg.error_cannot_clean_db'),
									type: 'error'
								});
							}
						)
						.pipe(
							function(data) {
								that.renderDataSQ(data);
							},
							function() {
								$.notice({
									message: $.t('msg.error_cannot_get_data'),
									type: 'error'
								});
							}
						);
				}
			});
		},

		switchTypeBtn: function() {
			var $this = $(this);
			var key = $this.attr('id').replace('gBtn_', '');
			var isOn = $this.hasClass('b-g-on');
			if(isOn) {
				$this.removeClass('b-g-on');
				$('.itemCard_' + key, that.$el).parent().hide('slow');
			} else {
				$this.addClass('b-g-on');
				$('.itemCard_' + key, that.$el).parent().show('slow');
			}
		}
	};
}(WT);
! function(WT) {
	var that;
	WT.Views = WT.Views || {};
	WT.Views.TargetPktSummary = function(el) {
		that = this;
		
		this.el = el;
		this.init();
	};

	WT.Views.TargetPktSummary.prototype = {
		init: function() {
			this.$el = $(this.el);
			var ipv4 = $('#ipv4', this.$el).val();
			this.getSummaryTypes()
				.pipe(
					function(data) {
						that.logTypeMpa(data);
						that.renderBtnGroup(data);
						return that.getTargetSummaryData(ipv4);
					},
					function(xhr, status, error) {
						$.notice({
							message: $.t('msg.error_cannot_get_summary_types'),
							type: 'error'
						});
					}
				)
				.pipe(
					function(data) {
						that.renderDataSQ(data);
					},
					function(xhr, status, error) {
						$.notice({
							message: $.t('msg.error_cannot_get_data'),
							type: 'error'
						});
					}
				);
		},

		logTypeMpa: function(data) {
			var typeMap = {};
			for(var i in data) {
				var type = data[i];
				typeMap[type.type] = type.name;
			}
			this.typeMap = typeMap;
		},

		getSummaryTypes: function() {
			var _dfd = $.Deferred();
			$.ajax({
				contentType: 'application/json',
				type: 'GET',
				url: '/api/v1/pkt-summary/types',
				dataType: 'json',
				cache: false,
				success: function(resp, status, xhr) {
					return _dfd.resolve(resp);
				},
				error: function(xhr, status, error) {
					return _dfd.reject(xhr, status, error);
				}
			});
			return _dfd.promise();
		},

		getTargetSummaryData: function(ipv4) {
			var params = {ipv4: ipv4}
			var _dfd = $.Deferred();
			$.ajax({
				contentType: 'application/json',
				type: 'GET',
				url: '/api/v1/target/pkt-summary/data',
				dataType: 'json',
				data: params,
				cache: false,
				success: function(resp, status, xhr) {
					return _dfd.resolve(resp);
				},
				error: function(xhr, status, error) {
					return _dfd.reject(xhr, status, error);
				}
			});
			return _dfd.promise();
		},

		renderBtnGroup: function(data) {
			var $tar = $('#types_btn_gp', this.$el).empty();
			for(var i in data) {
				var type = data[i];
				$('<a>').addClass('g-btn b-g-on')
						.attr({
							id: 'gBtn_' + type.type,
							href: 'javascript:;'
						})
						.text($.t(type.name))
						.on('click', this.switchTypeBtn)
						.appendTo($tar);
				if(i < (data.length - 1)) {
					$('<span class="g-separator"></span>').appendTo($tar);
				}
			}
		},

		renderDataSQ: function(data) {
			if($.isEmptyObject(data)) {
				$.notice({
					message: $.t('msg.error_no_data'),
					type: 'error'
				});
			}
			$('#data_sq', this.$el).empty();
			for(var ipv4 in data) {
				this.appendDataCard(ipv4, data[ipv4]);
			}
		},

		appendDataCard: function(ipv4, data) {
			var params = {
				ipv4: ipv4
			};
			var tpl = _.template($('#tpl_data_card').html());
			var $tpl = $(tpl(params));
			$tpl.i18n();
			for(var type in data) {
				var $li = this.renderDataCardItem(type, data[type]);
				$li.appendTo($('ul.list', $tpl));
			}
			$tpl.appendTo($('#data_sq', this.$el));
		},

		renderDataCardItem: function(type, data) {
			var params = {
				type: type,
				typeName: this.typeMap[type],
				data: data
			};
			var tpl = _.template($('#tpl_data_card_item').html());
			var $tpl = $(tpl(params));
			$tpl.i18n();
			var $li = $('<li>').addClass('col m-b-40').append($tpl);
			return $li;
		},

		switchTypeBtn: function() {
			var $this = $(this);
			var key = $this.attr('id').replace('gBtn_', '');
			var isOn = $this.hasClass('b-g-on');
			if(isOn) {
				$this.removeClass('b-g-on');
				$('.itemCard_' + key, that.$el).parent().hide('slow');
			} else {
				$this.addClass('b-g-on');
				$('.itemCard_' + key, that.$el).parent().show('slow');
			}
		}
	};
}(WT);

/**********
 * Main
 **********/
$(document).ready(function() {
	var options = {
		detectLngQS: 'lang',
		cookieName: 'lang',
		ns: { namespaces: ['translation'], defaultNs: 'translation'},
		resGetPath: '/locales/resources.json?lng=__lng__&ns=__ns__',
		dynamicLoad: true,
		sendMissing: true,
		useLocalStorage: false,
		//debug: true,
		sendMissingTo: 'current'
	};
	$.i18n.init(options, function() {
		$('html').i18n();
	});
	
	if($('#navigation').length) {
		new WT.Views.Navigation('#navigation');
	}
	if($('#accountManagement').length) {
		WT.Views.accountManagement = new WT.Views.AccountManagement('#accountManagement');
	}
	if($('#fakeAp').length) {
		WT.Views.fakeAp = new WT.Views.FakeAp('#fakeAp');
	}
	if($('#freeAp').length) {
		WT.Views.freeAp = new WT.Views.FreeAP('#freeAp');
	}
	if($('#phishingAccounts').length) {
		new WT.Views.PhishingAccounts('#phishingAccounts');
	}
	if($('#phishingSite').length) {
		new WT.Views.PhishingSite('#phishingSite');
	}
	if($('#messaging').length) {
		new WT.Views.Messaging('#messaging');
	}
	if($('#pktSummary').length) {
		new WT.Views.PktSummary('#pktSummary');
	}
	if($('#targetSummaryPkt').length) {
		new WT.Views.TargetPktSummary('#targetSummaryPkt');
	}
	$(document).ajaxComplete(function(event, xhr, settings) {
		WT.Common.Auth.isLogin(xhr.status);
	});
});