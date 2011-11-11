var fs = require("fs");
var http = require("http");
require("nat").init(http);
var url = require("url");

http.createServer(pageServer).listen(1338,"dcermina.heinz.cmu.edu");
console.log('Server running...');

function pageServer(request, response) {
	var reqURL = url.parse(request.url)
	var path = reqURL.pathname.substring(1);
	var responseHTML = catFile(request, path, response);
}

function catFile(request, filename, response) {
	fs.stat(
		filename,
		function(err,stats) {
			if (err) {
				response.writeHead(404, {'Content-Type': 'text/html'});
				response.write("<html><head><title>404 Not Found</title></head>");
				response.write("<body><h1>Not Found</h1><p>The requested URL /");
				response.end(filename+" was not found on this server.</body></html>");
				return;
				} 
			if (stats.isFile()) {
				var checkjs = filename.substring(filename.length-7);
				if(checkjs =="node.js"){
					var doJS = require(filename);
					doJS.execute(request, response);
				}
				else{
				var extension = filename.split(".").pop();
        if(extension == "css")
        {
          response.writeHead(200, {'Content-Type': 'text/css'});
        }
        else if(extension == "js")
        {
          response.writeHead(200, {'Content-Type': 'text/javascript'});
        }
        else if(extension == "png")
        {
          response.writeHead(200, {'Content-Type': 'image/png'});
        }
        else 
        {
          response.writeHead(200, {'Content-Type': 'text/html'});
        }
					fs.readFile(
						filename,
						function(err,data) {
							if (err) throw err;
							response.end(data);
						});
				}
			}
			else {
				if (stats.isDirectory()) {
					var indexPath = filename+"/index.html";
					fs.readFile(
						indexPath,
						"utf8",
						function(err,data) {
							if (err) {
								fs.readdir(filename,
									function(err,files) {
										if (err) throw err;
										response.writeHead(200, {'Content-Type': 'text/plain'});
										response.write("Index of /"+filename+"\n");
										files.forEach(function(file) {
											response.write(file+"\n");
										}) ;
										response.end();
									}
								);
							} else {
								response.writeHead(200, {'Content-Type': 'text/html'});
								response.end(data);
							}
						}
					);
				} else {
				console.log("Weird:  not file nor directory.");
				}
			}
			}
		);
	}