/**
 * A simple nodejs http Server
 * parse _GET and _POST (req.get & req.post)
 * @author jimmy.dong@gmail.com 2012.10.17
 */
var http = require('http')
    , fs = require('fs')
    , path = require('path')
    , querystring = require('querystring')
    , url = require('url')
    , _ = require('underscore');

var jdlog = function(s,v){
    if(v){console.log('(jd)[' + s + ']:');console.log(v);}
    else {console.log(s);}
}

var config = {'autoReload': true};

var server = http.createServer(function(req, res){
    var body = '';
    req.on('data', function (data) {
        body += data;
    });
    var post;
    req.on('end', function () {
    		//parse _GET & _POST & _COOKIE
    		t = url.parse(req.url, true);
    		req.pathname = t.pathname;
    		req.get = t.query;
    		req.post = querystring.parse(body);
        req.cookie = querystring.parse(req.headers.cookie);
				//handle req
        if(config.autoReload) autoReloadHandler(req, res);
        else handleReq(req, res);
        res.end();
    });
}).listen(8888,function(){jdlog('Listen begin...');})

//standard mode
var handleReq = function(req, res){
    var filePath = '.' + req.pathname;

		//myroute
		var myroute = {'blog':/\/blog\/post\/(\d+)\/?$/i, 'test\.js':/\/test/i}
		for(r in myroute){
			reg = myroute[r].exec(filePath);
			if(reg){
				//do something
				res.end('controller: ' + r);
				return;
			}
		}

    //static file
    if (filePath == './')
        filePath = './index.html';
    jdlog(" ...... load static page:" + filePath);
     
    fs.exists(filePath, function(exists) {
        if (exists) {
            fs.readFile(filePath, function(error, content) {
                if (error) {
                    res.writeHead(500);
                    res.end();
                }
                else {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(content, 'utf-8');
                }
            });
        }
        else {
            res.writeHead(404);
            res.end();
        }
    });
}

//autoReload mode
var requestHandler = require('./app.js');
fs.watchFile('./app.js', function () {
	jdlog('app.js had changed, auto reload it!');
  delete require.cache[require.resolve('./app.js')]
  requestHandler = require('./app.js');
})

var autoReloadHandler = function (req, res) {
  requestHandler.handle(req, res);
}


