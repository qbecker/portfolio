var path = require('path');
var fs = require('fs');
var appDir = path.dirname(require.main.filename);
var url = require('url');
var resolver = "/media";
var host = require('../config/config.js')


function get (req, res){
    var urlObj = url.parse(req.url, true, false);
    var pictureName = urlObj.pathname.split("/")[2];
    var picture =appDir+ "/stories/media/" + pictureName;
    fs.readFile(picture, function (err, data){
        if(err){
                res.setHeader('content-type','text/plain');
                res.code = 500;
                res.end("error rendering doc");
            console.log(err);
        }else{
            res.writeHead(200, {'content-type': 'image/gif', 'content-length':data.length});
              res.end(data);
        }
    });  
}

module.exports.resolver = resolver;
module.exports.get = get;