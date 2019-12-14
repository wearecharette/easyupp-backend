/**
 * Easyupp
 *
 * User: charette
 */

/**
 * Create express server
 */
var express = require('express'),
	app = express.createServer(),
	hbs = require('hbs'),
	email = require("./service/email.js"),
    	host = '127.0.0.1:5984',
	couchdbRemoveConflicts = require('couchdb-remove-conflicts'),
	CouchDBChanges = require("CouchDBChanges");

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

app.configure(function() {
	app.use(allowCrossDomain);
    app.use(express.methodOverride());
    app.use(express.bodyParser());
    app.use(app.router);
	app.set('view engine', 'hbs');
    app.set('views', __dirname + '/views');
});

app.configure('development', function() {
    app.use(express.static(__dirname + '/public'));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function() {
    var oneYear = 31557600000;
    app.use(express.static(__dirname + '/public', { maxAge: oneYear }));
    app.use(express.errorHandler());
});

/**
 * REST URL Mappings
 */
var gateways = require('./service/gateways.js');

app.post('/search', gateways.search);
app.post('/facets', gateways.facets);
app.post('/sendemail', gateways.sendemail);
app.get('/detail', gateways.detail);

/**
 * Start the application server
 */
app.listen(3030);
if (app.address() !== null) {
    console.log("Listening on port %d in %s mode", app.address().port, app.settings.env);
}
else {
    console.log("Failed to start. Ensure another instance is not running and port %d is available.", port);
}
