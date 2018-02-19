var fs = require('fs');
var http = require('http');
var url = require('url');
var vList = require('./views/list');
var vRead = require('./views/read');
var vDefault = require('./views/list');
var vMedia = require('./views/static');

var views = [];

views.push(vList);
views.push(vRead);
views.push(vMedia);
var viewsLength = views.length;


http.createServer(function(req, res){
   
    var urlObj = url.parse(req.url, true, false);
    
    for(var i = 0; i < viewsLength; i++){
        var mainPath = "/"+ urlObj.pathname.split("/")[1];
        if (views[i].resolver == mainPath){
            views[i].get(req, res);
            console.log("Request to page: " + mainPath);
            return;
        }
    }
    vDefault.get(req, res);
}).listen(8080);

console.log("Server up and running...");
module.exports.views = views;