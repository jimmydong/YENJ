/**
 * A simple nodejs http Server Request Handler
 * must run by server.js
 * write your code in this file, do not need restart the server nodejs, it auto reload! 
 *
 * @author jimmy.dong@gmail.com 2012.10.17
 */
var util = require('util')
    , _ = require('underscore');
var jdlog = function(s,v){
    if(v){console.log('(jd)[' + s + ']:');console.log(v);}
    else {console.log(s);}
}
var myController = {};
exports.handle = function(req, res){
    var filePath = '.' + req.pathname;
		//myroute
		var myroute = {'blog':/\/blog\/post\/(\d+)\/?$/i, 'test':/\/test/i}
		for(r in myroute){
			reg = myroute[r].exec(filePath);
			if(reg){
				myController[r](req, res);
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
myController.test = function(req, res){
				//call your control here... 
				res.setHeader("Content-Type", "text/html");
				res.write('It can be auto reloaded. Try modify this file and refresh in the browser! ');
				res.write('<hr><b>_GET</b><br>');
				res.write(util.inspect(req.get));
				res.write('<hr><b>_POST</b><br>');
				res.write(util.inspect(req.post));
				res.end('<hr>controller: ' + r);
}
myController.blog = function(req, res){
				//call your control here... 
				res.setHeader("Content-Type", "text/html");
				res.write('It is a blog!<br>');
				res.end('controller: ' + r);
}