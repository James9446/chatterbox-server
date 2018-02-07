/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
const querystring = require('querystring');

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept',
  'access-control-max-age': 10 // Seconds.
};

// {
//       username: 'Eric',
//       text: 'Here I am'
//     }, {
//       username: 'James',
//       text: 'There you are'
//     }

var classesDirectory = {
  messages: [{
    username: 'Eric',
    text: 'Here I am'
  }, {
    username: 'James',
    text: 'There you are'
  }],
  lobby: []
};

var exports = module.exports = {};

exports.requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);

  // The outgoing status.
  var statusCode = 200;

  // See the note below about CORS headers.
  var headers = defaultCorsHeaders;

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  headers['Content-Type'] = 'application/json';

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.

  // RESPONSE LOGIC 
  var responseObj = {
    results: []
  };
  
  // OPTIONS
  if (request.method === 'OPTIONS') {
    headers['Allow'] = 'GET, POST, OPTIONS';
    response.writeHead(statusCode, headers);
    response.end('Options request ended');
  }


  // GET
  if (request.method === 'GET') {
    // look for request.url in classesDirectory
    if (request.url.includes('/classes') || request.url.includes('createdAt')) {
      // if there - do the thing
      response.writeHead(statusCode, headers);
      responseObj.results = classesDirectory.messages;
      response.end(JSON.stringify(responseObj));
    } else {
    // if not, 404 not found
      statusCode = 404;
      response.writeHead(statusCode, headers);
      response.end();
    }
    //}
  }

  // POST 
  if (request.method === 'POST') {
    var body = [];
    statusCode = 201;
    response.writeHead(statusCode, headers);
    
    request.on('data', (chunk) => {
      body.push(Buffer(chunk));
    });
    request.on('end', () => {
      body = Buffer.concat(body).toString();
      // body = querystring.parse(body);
      body = JSON.parse(body);
      classesDirectory.messages.unshift(body);
      // console.log('server data: ', classesDirectory.messages);
      // console.log('headers:', headers);
      response.end(JSON.stringify({}));
    });
  }

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  // response.end(JSON.stringify(responseObj));
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.


