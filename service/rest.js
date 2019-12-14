var http = require("http");
var https = require("https"),
    inspect = require('eyes').inspector({maxLength: false});

/**
 * getJSON:  REST get request returning JSON object(s)
 * @param options: http options object
 * @param callback: callback to pass the results JSON object(s) back
 */
exports.getJSON = function(options, onResult) {
    var port = options.port == 443 ? https : http;
    var req = port.request(options, function(res) {
        var output = '';
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function() {
            onResult(res.statusCode, output);
        });
    });

    req.on('error', function(err) {
        console.log(err);
        //res.send('error: ' + err.message);
    });

    req.end();
};

/**
 * postJSON: post a JSON object to a REST service
 *
 * @param options
 * @param callback: callback to pass the results JSON object(s) back
 */
exports.postJSON = function(options, data, onResult) {
    var port = (options.port == 443) ? https : http;

    var req = port.request(options, function(res) {
        var output = '';
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function() {
            onResult(res.statusCode, output, res);
        });
    });

    req.on('error', function(err) {
		console.log(err);
    });

    req.write(data);
    req.end();
};

/**
 * deleteJSON: send a delete REST request with an id to delete
 *
 * @param options: http server options object
 * @param itemId: item id to delete
 * @param callback: callback to pass the results JSON object(s) back
 */
exports.deleteJSON = function(options, itemId, onResult) {
    var prot = options.port == 443 ? https : http;
    var req = prot.request(options, function(res) {
        var output = '';
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            output += chunk;
        });

        res.on('end', function() {
            var obj = eval("(" + output + ")");
            onResult(res.statusCode, obj);
        });
    });

    req.on('error', function(err) {
        // res.send('error: ' + err.message);
    });

    req.end();
};
