var fs = require('fs');
var http = require('http');
var url = require('url');
var path = require('path');
var appDir = path.dirname(require.main.filename);
var buffer = require('buffer');

var resolver = "/read";
var contents;

function readStory(story, callback){
      fs.readFile(story, function(err, contents){
        if(err){
          console.log(err);
            return;
        }
        return callback(contents);
    });
}

function assembleFragments(fragmentArr, callback){
    
    var fragReady = [];
    for(var i = 0; i < fragmentArr.length; i++){
      var  fragment = appDir +"/stories" + "/" + fragmentArr[i];
      
      fs.readFile(fragment,function(err, fragContents){
        if(err){
            console.log(err);
        } else {
            fragReady.push(fragContents);
        }
        
        var allDone = true;
        for (var aPart = 0; aPart < fragmentArr.length; aPart++) {
            if (fragReady[aPart] == null) {
                allDone = false;
            }
        }
        if (allDone) {
            callback(fragReady.join(""))
        }
    });
    }
}

function get (req, res){
    console.log("Entering get of read")
        var urlObj = url.parse(req.url, true, false);
        var storyName = urlObj.pathname.split("/")[2];
        var story = appDir + "/stories" + "/" + storyName + ".story";
        this.storyString = story;
        
        readStory(this.storyString, function(contents){
                var contents = JSON.parse(contents);
                assembleFragments(contents["Fragments"],function(fragReady){
                    var responseBuffer = [];
                    res.statusCode = 200;
                    responseBuffer.push('<HTML>');
                    responseBuffer.push('<BODY>');
                    responseBuffer.push('<CENTER>');
                    responseBuffer.push(fragReady);
                    responseBuffer.push('</CENTER>');
                    responseBuffer.push('</BODY>');
                    responseBuffer.push('</HTML>');
                    res.end(responseBuffer.join(""));
                });
                
        });
 
}

module.exports.resolver = resolver;
module.exports.get = get;