var rest = require("./rest.js");

var _appId = '',
    _restAPIKey = '',
    querystring = require('querystring');

var log = function() { return console.log.apply(console, arguments); };

/**
 * initialize parse with secrets (your appId and restAPIKey)
 *
 * @param appId:  Application Id from Parse
 * @param restAPIKey:  REST API Key from Parse
 */
exports.initialize = function(appId, restAPIKey) {
    _appId = appId;
    _restAPIKey = restAPIKey;
};

var auth = 'Basic ' + new Buffer('xxx').toString('base64');

/**
 * Convenience function to create http options for parse.
 * This sets up the url, port and headers while expecting callers to set path and method
 */
var getParseOptions = function() {
    var options = {
        host: 'gateway.sagepayments.net',
				path: '/cgi-bin/eftBankcard.dll?transaction',
        port: 443,
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    return options;
};

/**
 * Convenience function to create http options for parse.
 * This sets up the url, port and headers while expecting callers to set path and method
 */
var getUPS = function() {
    var options = {
        host: 'onlinetools.ups.com',
				path: '/ups.app/xml/Rate',
        port: 443,
        method: 'POST',
				headers: {
					'Content-Type': 'XML'
				}
    };

    return options;
};

/**
 * Convenience function to create http options for parse.
 * This sets up the url, port and headers while expecting callers to set path and method
 */
var getCouchOptions = function() {
    var options = {
        host: '127.0.0.1',
        port: 5984,
        method: 'POST',
        headers: {
        	'Content-Type': 'application/x-www-form-urlencoded',
		'Authorization': auth
        }
    };

    return options;
};

/**
 * Convenience function to create http options for parse.
 * This sets up the url, port and headers while expecting callers to set path and method
 */
var getCouchOrder = function() {
    var options = {
      host: '127.0.0.1',
      port: 5984,
			method: 'GET',
			headers: {
				'Authorization': auth
			}
    };

    return options;
};

/**
 * Convenience function to create http options for parse.
 * This sets up the url, port and headers while expecting callers to set path and method
 */
var getCurebit = function() {
    var options = {
      host: 'www.curebit.com',
      port: 443,
      method: 'GET'
    };

    return options;
};

/**
 * Parse Post:  Posts couch docs
 * @param couch json object
 * @param onResults: callback function for results
 */
exports.postCouch = function(opts, onResult) {
  var options = getCouchOptions();
	options.path = opts.path;
	var data = "";

	if (opts.type === 'json') {
		options.headers['Content-Type'] = 'application/json';
		data = opts.data;
	}
	else {
		data = querystring.stringify(opts);
		options.headers['Content-Length'] = data.length;
	}
    console.log('pushing this\n\n');
    console.log(options);
    console.log(data);
    rest.postJSON(options, data, onResult);
};

/**
 * Parse Post:  Posts transaction
 * @param transaction json object
 * @param onResults: callback function for results
 */
exports.post = function(transaction, onResult) {
	var options = getParseOptions();
	transaction.m_id = _appId;
	transaction.m_key = _restAPIKey;
	var data = querystring.stringify(transaction);
	options.method = 'POST';
	options.headers['Content-Length'] = data.length;

	rest.postJSON(options, data, onResult);
};

/**
 * Parse Query:  Querys objects of a user.
 * @param user
 * @param onResults: callback function for results
 */
exports.query = function(opts, onResults) {
	var options = getCouchOrder();
	options.path = (!opts.path) ? '/query?' : opts.path + '?';
	delete opts.path;
	options.path += querystring.stringify(opts);

	rest.getJSON(options, onResults);
};

/**
 * Parse Query:  Querys objects of a user.
 * @param user
 * @param onResults: callback function for results
 */
exports.curebit = function(opts, onResults) {
	var options = getCurebit();
	options.path = opts.path;
	delete opts.path;
	options.path += querystring.stringify(opts);

	rest.getJSON(options, onResults);
};

/**
 * Parse Query:  Querys objects of a user.
 * @param user
 * @param onResults: callback function for results
 */
exports.get = function(opts, onResults) {
	var options = getCouchOrder();
	options.path = opts.path;
	delete opts.path;
	options.path += querystring.stringify(opts);

	rest.getJSON(options, onResults);
};

/**
 * Parse Query:  Querys objects of a user.
 * @param user
 * @param onResults: callback function for results
 */
exports.postUPS = function(data, onResults) {
	var options = getUPS();
	options.headers['Content-Length'] = data.length;
	rest.postJSON(options, data, onResults);
};

	/**
	* Parse Query:  Querys objects of a UPS.
	* @param user
	* @param onResults: callback function for results
*/
exports.postUPSAddress = function(data, onResults) {
	var options = getUPS();
	options.headers['Content-Length'] = data.length;
	options.path = '/ups.app/xml/XAV';
	rest.postJSON(options, data, onResults);
};
