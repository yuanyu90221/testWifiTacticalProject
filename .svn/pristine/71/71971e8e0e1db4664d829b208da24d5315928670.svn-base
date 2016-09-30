
/**********
 * Module dependencies.
 **********/

var express                = require('express'),
	http                   = require('http'),
	path                   = require('path'),
	i18next                = require('i18next'),
	prop                   = require('./constant/wifitactical_prop'),
	FakeAp                 = require('./models/fakeAp'),
	// habdle
	authorizationHandle    = require('./security/authorizationHandle'),
	crossDomainHandler     = require('./handle/crossDomainHandler'),
	summaryDataTransferJob = require('./job/summaryDataTransferJob'),
	summaryImageCloningJob = require('./job/summaryImageCloningJob'),
	reverseImageCloningJob = require('./job/reverseImageCloningJob'),
	// controller
	routes                 = require('./routes'),
	userCtrl               = require('./routes/userCtrl'),
	messagingMonitorCtrl   = require('./routes/messagingMonitorCtrl'),
	fakeAPCtrl             = require('./routes/fakeAPCtrl'),
	freeAPCtrl             = require('./routes/freeAPCtrl'),
	phishingAccountCtrl    = require('./routes/phishingAccountCtrl'),
	phishingSiteCtrl       = require('./routes/phishingSiteCtrl'),
	accountManagementCtrl  = require('./routes/accountManagementCtrl'),
	pktSummaryCtrl         = require('./routes/pktSummaryCtrl'),
	targetManagementCtrl   = require('./routes/targetManagementCtrl'),
	//api
	userApi                = require('./api/userApi'),
	roleApi                = require('./api/roleApi'),
	targetApi              = require('./api/targetApi'),
	phishingSiteApi        = require('./api/phishingSiteApi'),
	fakeApApi              = require('./api/fakeApApi'),
	freeAPApi              = require('./api/freeApApi'),
	chatApi                = require('./api/chatApi'),
	pktSummaryApi          = require('./api/pktSummaryApi');

var app = express();
// i18n
i18next.init({
	debug: true,
	detectLngQS: 'lang',
	cookieName: 'lang',
	ns: 'translation',
	resGetPath: path.join(__dirname, 'locales/__lng__/__ns__.json'),
	ignoreRoutes: ['css/', 'font/', 'images/', 'js/', 'locales/']
});

// all environments
app.set('port', process.env.PORT || prop.get('web.port'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
//app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser('wifitactical'));
app.use(express.session({
	secret: 'wifitactical',
	cookie:{maxAge:1800000}
}));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(500).send();
});
app.use(i18next.handle);
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
// i18n
i18next.registerAppHelper(app)
	.serveClientScript(app)
	.serveDynamicResources(app)
	.serveMissingKeyRoute(app);

i18next.serveWebTranslate(app, {
	i18nextWTOptions: {
		languages: ['zh-TW', 'en-US', 'dev'],
		namespaces: ['translation'],
		resGetPath: '/locales/resources.json?lng=__lng__&ns=__ns__',
		resChangePath: '/locales/change/__lng__/__ns__',
		resRemovePath: '/locales/remove/__lng__/__ns__',
		fallbackLng: 'dev',
		dynamicLoad: true
	}
});

app.get ('/',                                routes.index);
/** Ctrl **/
// login & logout
//app.get   ('/login',                         authorizationHandle.checkNotLogin);
app.get   ('/login',                         [authorizationHandle.checkNotLogin, userCtrl.login]);
app.post  ('/login',                         authorizationHandle.checkNotLogin);
app.post  ('/login',                         userCtrl.logon);
app.get   ('/logout',                        userCtrl.logout);
// app.get   ('/signup',                        authorizationHandle.checkNotLogin);
// app.get   ('/signup',                        userCtrl.signup);
// app.post  ('/signup',                        authorizationHandle.checkNotLogin);
// app.post  ('/signup',                        userCtrl.register);
// app.get   ('/activate',                      userCtrl.activate);
// app.get   ('/reactivate',                    userCtrl.getReactivateMail);
// app.post  ('/reactivate',                    userCtrl.sendReactivateMail);
// messaging monitor
app.get   ('/monitor/messaging',             authorizationHandle.checkLogin);
app.get   ('/monitor/messaging',             messagingMonitorCtrl.index);

app.get   ('/monitor/messaging/file',        authorizationHandle.checkLogin);
app.get   ('/monitor/messaging/file',        messagingMonitorCtrl.getFile);
// fake ap
app.get   ('/hacker/fake-ap',                authorizationHandle.checkLogin);
app.get   ('/hacker/fake-ap',                fakeAPCtrl.index);
// free ap
app.get   ('/hacker/free-ap',                authorizationHandle.checkLogin);
app.get   ('/hacker/free-ap',                freeAPCtrl.index);
// phishing account
app.get   ('/hacker/phishing',               authorizationHandle.checkLogin);
app.get   ('/hacker/phishing',               phishingAccountCtrl.index);
// phishing site
app.get   ('/hacker/phishingSite',           authorizationHandle.checkLogin);
app.get   ('/hacker/phishingSite',           phishingSiteCtrl.index);
// account management
app.get   ('/management/user',               authorizationHandle.checkLogin);
app.get   ('/management/user',               authorizationHandle.checkRoleAdmin);
app.get   ('/management/user',               accountManagementCtrl.index);
// pkt decoder
app.get   ('/pkt-decoder/summary',           authorizationHandle.checkLogin);
app.get   ('/pkt-decoder/summary',           pktSummaryCtrl.index);

app.get   ('/pkt-decoder/target/summary',    authorizationHandle.checkLogin);
app.get   ('/pkt-decoder/target/summary',    pktSummaryCtrl.target);

app.get   ('/pkt-decoder/summary/file',      authorizationHandle.checkLogin);
app.get   ('/pkt-decoder/summary/file',      pktSummaryCtrl.getFile);

// target management
/*
app.get   ('/management/target',             authorizationHandle.checkLogin);
app.get   ('/management/target',             authorizationHandle.checkRoleAdmin);
app.get   ('/management/target',             targetManagementCtrl.index);
*/
/** Api **/
// user
app.get   ('/api/v1/users',                  authorizationHandle.checkLogin4Ajax);
app.get   ('/api/v1/users',                  authorizationHandle.checkRoleAdmin4Ajax);
app.get   ('/api/v1/users',                  crossDomainHandler.allow);
app.get   ('/api/v1/users',                  userApi.getAll);

app.post  ('/api/v1/users',                  authorizationHandle.checkLogin4Ajax);
app.post  ('/api/v1/users',                  authorizationHandle.checkRoleAdmin4Ajax);
app.post  ('/api/v1/users',                  crossDomainHandler.allow);
app.post  ('/api/v1/users',                  userApi.save);

app.get   ('/api/v1/users/:id',              authorizationHandle.checkLogin4Ajax);
app.get  ('/api/v1/users/:id',               crossDomainHandler.allow);
app.get   ('/api/v1/users/:id',              userApi.getById);

app.put   ('/api/v1/users/:id',              authorizationHandle.checkLogin4Ajax);
app.put   ('/api/v1/users/:id',              crossDomainHandler.allow);
app.put   ('/api/v1/users/:id',              userApi.update);

app.delete('/api/v1/users/:id',              authorizationHandle.checkLogin4Ajax);
app.delete('/api/v1/users/:id',              authorizationHandle.checkRoleAdmin4Ajax);
app.delete('/api/v1/users/:id',              crossDomainHandler.allow);
app.delete('/api/v1/users/:id',              userApi.deleteById);

app.get   ('/api/v1/user_targets',           authorizationHandle.checkLogin4Ajax);
app.get   ('/api/v1/user_targets',           crossDomainHandler.allow);
app.get   ('/api/v1/user_targets',           userApi.getTargets);

app.get   ('/api/v1/user_targets/:username', authorizationHandle.checkLogin4Ajax);
app.get   ('/api/v1/user_targets/:username', crossDomainHandler.allow);
app.get   ('/api/v1/user_targets/:username', userApi.getTargets);

app.post  ('/api/v1/user_targets/:username', authorizationHandle.checkLogin4Ajax);
app.post  ('/api/v1/user_targets/:username', crossDomainHandler.allow);
app.post  ('/api/v1/user_targets/:username', userApi.addOrRemoveTargets);

// role
app.get   ('/api/v1/roles',                  authorizationHandle.checkLogin4Ajax);
app.get   ('/api/v1/roles',                  crossDomainHandler.allow);
app.get   ('/api/v1/roles',                  roleApi.getAll);

// target
app.get   ('/api/v1/targets',                authorizationHandle.checkLogin4Ajax);
app.get   ('/api/v1/targets',                crossDomainHandler.allow);
app.get   ('/api/v1/targets',                targetApi.getAll);

app.get   ('/api/v1/targets/:id/apps',       authorizationHandle.checkLogin4Ajax);
app.get   ('/api/v1/targets/:id/apps',       crossDomainHandler.allow);
app.get   ('/api/v1/targets/:id/apps',       targetApi.getTargetApps);
/*
app.post  ('/api/v1/targets',                authorizationHandle.checkLogin4Ajax);
app.post  ('/api/v1/targets',                targetApi.save);

app.delete('/api/v1/targets/:id',            authorizationHandle.checkLogin4Ajax);
app.delete('/api/v1/targets/:id',            targetApi.deleteById);
*/
// phishing site
app.get   ('/api/v1/phishing_sites',                   authorizationHandle.checkLogin4Ajax);
app.get   ('/api/v1/phishing_sites',                   crossDomainHandler.allow);
app.get   ('/api/v1/phishing_sites',                   phishingSiteApi.getAll);

app.post  ('/api/v1/phishing_sites',                   crossDomainHandler.allow);
app.post  ('/api/v1/phishing_sites',                   phishingSiteApi.save);

app.get   ('/api/v1/phishing_sites/:siteKey/accounts', authorizationHandle.checkLogin4Ajax);
app.get   ('/api/v1/phishing_sites/:siteKey/accounts', crossDomainHandler.allow);
app.get   ('/api/v1/phishing_sites/:siteKey/accounts', phishingSiteApi.getPhishAccounts);

app.get   ('/api/v1/phishing_sites/:siteKey/startupRule', authorizationHandle.checkLogin4Ajax);
app.get   ('/api/v1/phishing_sites/:siteKey/startupRule', crossDomainHandler.allow);
app.get   ('/api/v1/phishing_sites/:siteKey/startupRule', phishingSiteApi.startupWebsiteRule);

app.get   ('/api/v1/phishing_sites/:siteKey/shutdownWebsiteRule', authorizationHandle.checkLogin4Ajax);
app.get   ('/api/v1/phishing_sites/:siteKey/shutdownWebsiteRule', crossDomainHandler.allow);
app.get   ('/api/v1/phishing_sites/:siteKey/shutdownWebsiteRule', phishingSiteApi.shutdownWebsiteRule);

// fake ap
app.get   ('/api/v1/network_nodes',         authorizationHandle.checkLogin4Ajax);
app.get   ('/api/v1/network_nodes',         crossDomainHandler.allow);
app.get   ('/api/v1/network_nodes',         fakeApApi.getNetworkNodes);

app.get   ('/api/v1/network_attack_on',     authorizationHandle.checkLogin4Ajax);
app.get   ('/api/v1/network_attack_on',     crossDomainHandler.allow);
app.get   ('/api/v1/network_attack_on',     fakeApApi.startToAttackAP);

app.get   ('/api/v1/network_attack_off',    authorizationHandle.checkLogin4Ajax);
app.get   ('/api/v1/network_attack_off',    crossDomainHandler.allow);
app.get   ('/api/v1/network_attack_off',    fakeApApi.stopAttackingAp);

app.get   ('/api/v1/network_attack_status', authorizationHandle.checkLogin4Ajax);
app.get   ('/api/v1/network_attack_status', crossDomainHandler.allow);
app.get   ('/api/v1/network_attack_status', fakeApApi.checkAttackStatus);

app.get   ('/api/v1/network_attack_now',    authorizationHandle.checkLogin4Ajax);
app.get   ('/api/v1/network_attack_now',    crossDomainHandler.allow);
app.get   ('/api/v1/network_attack_now',    fakeApApi.checkAttacking);

app.get   ('/api/v1/disable_web_auth',      fakeApApi.disableWebAuth);

// free ap
app.get   ('/api/v1/free_ap/status',        authorizationHandle.checkLogin4Ajax);
app.get   ('/api/v1/free_ap/status',        crossDomainHandler.allow);
app.get   ('/api/v1/free_ap/status',        freeAPApi.queryStatus);

app.get   ('/api/v1/free_ap/startup',       authorizationHandle.checkLogin4Ajax);
app.get   ('/api/v1/free_ap/startup',       crossDomainHandler.allow);
app.get   ('/api/v1/free_ap/startup',       freeAPApi.startupFreeAp);

app.get   ('/api/v1/free_ap/shutdown',      authorizationHandle.checkLogin4Ajax);
app.get   ('/api/v1/free_ap/shutdown',      crossDomainHandler.allow);
app.get   ('/api/v1/free_ap/shutdown',      freeAPApi.shutdownFreeAp);

app.get   ('/api/v1/free_ap/connections',   authorizationHandle.checkLogin4Ajax);
app.get   ('/api/v1/free_ap/connections',   crossDomainHandler.allow);
app.get   ('/api/v1/free_ap/connections',   freeAPApi.getConnectedClient);

app.post  ('/api/v1/free_ap/connections',   crossDomainHandler.allow);
app.post  ('/api/v1/free_ap/connections',   freeAPApi.logClientSigninInfo);

// messaging
app.get   ('/api/v1/chats',                 authorizationHandle.checkLogin4Ajax);
app.get   ('/api/v1/chats',                 crossDomainHandler.allow);
app.get   ('/api/v1/chats',                 chatApi.getChatrooms);

app.get   ('/api/v1/chat/messages',         authorizationHandle.checkLogin4Ajax);
app.get   ('/api/v1/chat/messages',         crossDomainHandler.allow);
app.get   ('/api/v1/chat/messages',         chatApi.getChatContent);

app.get   ('/api/v1/chat/messages',         authorizationHandle.checkLogin4Ajax);
app.get   ('/api/v1/chat/messages',         crossDomainHandler.allow);
app.get   ('/api/v1/pkt-summary/types',     pktSummaryApi.getPktSummaryTypes);

// packet summary
app.get   ('/api/v1/pkt-summary/data',        authorizationHandle.checkLogin4Ajax);
app.get   ('/api/v1/pkt-summary/data',        crossDomainHandler.allow);
app.get   ('/api/v1/pkt-summary/data',        pktSummaryApi.getPktSummaryData);

app.delete('/api/v1/pkt-summary/data',        authorizationHandle.checkLogin4Ajax);
app.delete('/api/v1/pkt-summary/data',        crossDomainHandler.allow);
app.delete('/api/v1/pkt-summary/data',        pktSummaryApi.deletePktSummaryData);

app.get   ('/api/v1/target/pkt-summary/data', authorizationHandle.checkLogin4Ajax);
app.get   ('/api/v1/target/pkt-summary/data', crossDomainHandler.allow);
app.get   ('/api/v1/target/pkt-summary/data', pktSummaryApi.getPktSummaryDataByIpv4);

var server = http.createServer(app).listen(app.get('port'), function() {
	console.log('Express server listening on port ' + app.get('port'));
	if(prop.get('web.type') == 'wifitactical') {
		summaryDataTransferJob.start();
	}/* else {
		reverseImageCloningJob.start();
	}*/
});

function cleanup() {
	server.close(function () {
		if(prop.get('web.type') == 'wifitactical') {
			FakeAp.unattackAp(function(err, result) {
				if(err) console.log('No attack now!');
				if(result) console.log('Has closed attack!');
			});
			summaryDataTransferJob.stop();
		}/* else {
			reverseImageCloningJob.start();
		}*/
		process.exit();
	});
}

process.on ('SIGTERM', cleanup);
process.on ('SIGINT', cleanup);