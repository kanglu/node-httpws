# node-httpws
A sample http and web socket server using express with optional secure certificates setup.

The setup was super simple after using this [reference from Chovy's Blog](http://www.chovy.com/web-development/self-signed-certs-with-secure-websockets-in-node-js/).
	
This is not production worthy code.

# modules used

* express
* https
* ws

# usage

	node app.js [secure]

If you specify the optional secure parameter, then the server will listen in using a self signed certificate configured to localhost. The certificates were created using:

	    openssl req -x509 -newkey rsa:2048 -keyout key.pem -out cert.pem -days 100 -nodes

On my MacBook Pro.

Once the server is up, then on a browser goto ```http://localhost:8443```. This will show a page that uses web sockets.

If you want to try static content, then goto ```http://localhost:8443/sample.pdf```, which will download this page in pdf format.

If you want to use a different port, then modify it in ```app.js```.