var fs = require('fs');
var rootDIR = __dirname;
var resolver = "/default";
var path = require('path');
var host = require('../config/config.js')
var appDir = path.dirname(require.main.filename);
var storys = [];



function parseCookies (req) {
    var list = {},
        rc = req.headers.cookie;

    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });
    
    return list;
}




function getStorys(callback, role){
    
    var dir = appDir + "/stories";
    console.log(dir)
    fs.readdir(dir, function(err, files){
        if(err){
            console.log(err);
            return;
        }
        files.forEach(function(f){
            if(/\.(story)$/i.test(f)){
                var file = dir + "/"+ f;
               
                // fs.readFile(file, function(err, contents){
                //     if(err){
                //         console.log("this is the error: " + err);
                //     }
                //     console.log( "contents not at end: " +contents);
                //     var rawFile = JSON.parse(contents.toString());
                //     console.log(rawFile);
                //     var sAuthor = rawFile["Author"];
                //     var sPublic = rawFile["Public"];

                // });
                
                storys.push(f);
            }
        });
        return callback(storys);
    });
    
}



function get (req, res){
    getStorys(function(){
        var responseBuffer = [];
        res.statusCode = 200;
        res.setHeader('content-type', 'text/html');
        responseBuffer.push('<HTML>');
        responseBuffer.push('<BODY>');
        responseBuffer.push('<CENTER>');
        responseBuffer.push('<H2>Stories: </H2>');
         for(var i = 0; i < storys.length; i++){
             var file = appDir + "/stories/" + storys[i];
             var metaData = fs.readFileSync(file);
             var parsed = JSON.parse(metaData);
             var author = parsed["Author"];
             var isPublic = parsed["Public"];
             responseBuffer.push('<a HREF = "http://'+ host + '/read/'  + storys[i].split(".")[0]  +  ' "> ' + storys[i].split(".")[0] +'</a><BR>' );
          }
        responseBuffer.push('</CENTER>');
        responseBuffer.push('</BODY>');
        responseBuffer.push('</HTML>');
        res.end(responseBuffer.join(""));
        storys = [];
        });
}

module.exports.resolver = resolver;
module.exports.get = get;