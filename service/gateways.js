var cookie = require('cookie'),
	_ = require('underscore')._,
	format = require('accounting'),
	hbs = require('hbs'),
	xml2js = require('xml2js'),
	email = require("./email.js"),
	sha = require('./sha1.js'),
	crypto = require('crypto'),
	gm = require('gm'),
	im = gm.subClass({ imageMagick: true }),
	httpget = require('http-get'),
	fs = require('fs'),
	nano = require('nano')('http://127.0.0.1:5984'),
	endue = nano.db.use('endue'),
	inspect = require('eyes').inspector({maxLength: false}),
	ua = require('universal-analytics');

	_.str = require('underscore.string');
	_.mixin(_.str.exports());

	var formatOptions = {
		symbol : "$",
		decimal : ".",
		thousand: "",
		precision : 2,
		format: "%v"
	};

/**
 * email client
 *
 * @param   req: the http server request object
 * @param   res: the http server response object
 */

exports.sendemail = function(req, res) {
	var mail = {
                From: 'earlybird@easyupp.com',
                To: req.body.email,
                Subject: 'Earlybird signup - ' + req.body.name,
                TextBody: 'Type: ' + req.body.type + '<br/>Name: ' + req.body.name + '<br/>Email: ' + req.body.email + '<br/>Phone: ' + req.body.phone + '<br/>Message: ' + req.body.message
            },
            pathToTemplate = require('path').resolve(__dirname, '../', 'views') + '/mobile-basicmobile.html',
            template = require('fs').readFileSync(pathToTemplate, 'utf8'),
            hbsFn = hbs.compile(template, { filename: pathToTemplate, pretty: true });
            console.log(mail);
            mail.HtmlBody = hbsFn(mail);
            email.sendEmail(mail, function(result) {
               console.log(result);
		res.status(200);
                res.send({'sent':true});
                res.end();
		return;
            });
}
exports.detail = function(req, res) {
	var MarketcheckCarsApi = require('marketcheck_cars_api');

	var apiInstance = new MarketcheckCarsApi.ListingsApi();

	var id = req.query.detail_id;
//console.log(id);
	var opts = {
		'apiKey': "fG3KnrhDJy9UBdhj4oo6Mac493ZqxLol"
	};

	var callback = function(error, data, response) {
		if (error) {
			console.error('detail error ' + JSON.stringify(req.query));
		} else {
			res.setHeader('Content-Type', 'application/json');
                        res.status(200);
                        res.send(JSON.stringify(data));
		}
	};
	apiInstance.getListing(id, opts, callback);

}

exports.facets = function(req, res) {
	var MarketcheckCarsApi = require('marketcheck_cars_api');

        var api = new MarketcheckCarsApi.ListingsApi();

	var opts = {
	    fields: "year,make,model",
      apiKey: "fG3KnrhDJy9UBdhj4oo6Mac493ZqxLol"
	};
	var callback = function(error, data, response) {
		if (error) {
    			//console.error(error);
			res.setHeader('Content-Type', 'application/json');
                        res.status(200);
                        res.send(JSON.stringify(data));
  		} else {
    			//console.log('API called successfully. Returned data: ' + data);
			res.setHeader('Content-Type', 'application/json');
                        res.status(200);
                        res.send(JSON.stringify(data));
  		}
	};
	api.search(opts, callback);

}

exports.search = function(req, res) {
	var MarketcheckCarsApi = require('marketcheck_cars_api');

	var api = new MarketcheckCarsApi.ListingsApi();

	var returnData = [];
	var make = [];
	var model = [];
	var year = [];
	var count = 0
	var dealers = req.body.dealers.split(',');

	var strt = ( typeof req.body.page !== 'undefined' ) ? req.body.page : 1;

	var opts = {
	    apiKey: "fG3KnrhDJy9UBdhj4oo6Mac493ZqxLol",
            // domRange: '0-150',
	    rows: 50,
	    start: strt,
	    facets: "year,make,model"
	};

        if ( typeof req.body.ymmt !== 'undefined' && req.body.ymmt !== '' && req.body.ymmt !== '||' ) {
          opts['ymmt'] = req.body.ymmt;
        };

        if ( typeof req.body.year !== 'undefined' && req.body.year !== '' ) {
          opts['year'] = req.body.year;
        };
	if ( typeof req.body.color !== 'undefined' && req.body.color !== '' ) {
          opts['exteriorColor'] = req.body.color;
        };
	if ( typeof req.body.inventory_type !== 'undefined' && req.body.inventory_type !== '' ) {
          opts['carType'] = req.body.inventory_type;
        };
        if ( typeof req.body.make !== 'undefined' && req.body.make !== '' ) {
          opts['make'] = req.body.make;
        };
        if ( typeof req.body.model !== 'undefined' && req.body.model !== '' ) {
          opts['model'] = req.body.model;
        };
        if ( typeof req.body.sort !== 'undefined' && req.body.sort !== '' ) {
          opts['sortBy'] = req.body.sort;
          opts['sortOrder'] = 'asc';
        };
        if ( typeof req.body.range !== 'undefined' && req.body.range !== '' ) {
          opts['priceRange'] = req.body.range;
        }
	else {
	  // opts['priceRange'] = '1-150000';
	}
//console.log(opts);

	var callback = function(error, data, response) {
		count = count + 1;
		if (error) {
		//	console.log(error);
		//	console.error('listing error ' + JSON.stringify(req.body));
		}
		else {
		//	console.log(data);
			returnData = returnData.concat(data.listings);
			if (typeof data.facets != "undefined") {
		//		console.log('pizza time');
		//		console.log(data.facets.make);
				make = make.concat(data.facets.make);
				model = model.concat(data.facets.model);
				year = year.concat(data.facets.year);
			}
		}
		if (dealers.length == count) {
			var rData = {
				listings: returnData,
				makes: make,
				models: model,
				years: year
			}
		//	console.log(rData)
			res.setHeader('Content-Type', 'application/json');
        		res.status(200);
                        res.send(JSON.stringify(rData));
		}
	};
	for (let i = 0; i < dealers.length; i++) {
    		setTimeout(function() {
			opts['dealerId'] = dealers[i];
			//console.log(opts);
        		api.search(opts, callback);
    		}, 10 * i);
	}

}
