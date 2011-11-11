var url = require("url");
var http = require("http");

exports.execute = function(request, response) {

	var reqURL = url.parse(request.url);	
	console.log("url search: " + reqURL.search);

	var artist = reqURL.search.substring(7);
	console.log("artist: " + artist);
  
  var dataString = "";
  
  var options = {
    host: 'ws.audioscrobbler.com',
    path: '/2.0/?method=artist.getsimilar&autocorrect=1&limit=3&artist=' + artist + '&format=json&api_key=028a648a94b5ca3a256ed241d7952a20',
    port: 80
    }
  
    http.get(options, function(result){
      result.on('error', function(e) {
  			console.log("Got error: " + e.message);
        });
      result.setEncoding('utf8');
      result.on('data', function (data) {
  			dataString = dataString + data;
        }); 
  		result.on('end', function() {
  			var artistData=JSON.parse(dataString);
  			console.log("response: "+artistData.statusCode);
  			console.log("response: "+JSON.stringify(artistData));
        if(artistData.error > 1)
        {
          response.writeHead(200, {'Content-Type': 'application/json'});
          var reply = new Object();
          reply.error = artistData.error;
        }
        else
        {
          var artist1url = artistData.similarartists.artist[0].url;
          var artist2url = artistData.similarartists.artist[1].url;
          var artist3url = artistData.similarartists.artist[2].url;
          var artist1name = artistData.similarartists.artist[0].name;
          var artist2name = artistData.similarartists.artist[1].name;
          var artist3name = artistData.similarartists.artist[2].name;
          response.writeHead(200, {'Content-Type': 'application/json'});
    			var reply = new Object();
          reply.error = 0;
    			reply.artist1name = artist1name;
          reply.artist2name = artist2name;
          reply.artist3name = artist3name;
          reply.artist1url = artist1url;
          reply.artist2url = artist2url;
          reply.artist3url = artist3url; 
        }
  			response.end(JSON.stringify(reply)); 	
     });  
});
}