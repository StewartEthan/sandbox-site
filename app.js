// Initial app setup
var express = require('express'),
    stylus  = require('stylus'),
    http    = require('http');

var app = express();

const httpMethods = ["GET", "HEAD", "POST", "PUT", "DELETE", "CONNECT", "OPTIONS"];
function xhrserver(method, url, headers, data, cb) {
  // Handle potential errors with params
  if (httpMethods.indexOf(method) === -1) {
    throw new Error('You must use a valid HTTP method');
  }
  if (typeof url !== "string" || url === '') {
    throw new Error('url argument must not be empty');
  }
  if (headers === undefined) headers = null;
  if (data === undefined) data = null;

  const xhreq = new XMLHttpRequest();

  xhreq.open(method, url, true);

  xhreq.onreadystatechange = e => {
    if (xhreq.readyState === XMLHttpRequest.DONE) {
      // Only use cb if its a function, allowing for it to be optional
      if (typeof cb === 'function') {
        cb(xhreq);
      }
    }
  }

  // Set each header
  for (let key in headers) {
    xhreq.setRequestHeader(key, headers[key]);
  }

  xhreq.send(data);
}

// Specify the port (I use 3000 as a default for personal dev)
app.set('port', (process.env.PORT || 3000));

// Specify where static assets should be loaded from
app.use(express.static('assets'));
app.use('/assets', express.static('assets'));

// Set the views and views engine
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// Set up routes for the app
// TODO: Use separate routes.js file???
// main (root) route
app.get('/', (req,res) => {
  res.render('home-page');
});
// /apps routes
app.get('/apps', (req,res) => {
  res.render('apps');
});
app.get('/apps/:appName', (req,res) => {
  res.render(`apps/${req.params.appName}`);
});
// /code routes
app.get('/code', (req,res) => {
  res.render('code');
});
// /blog routes
app.get('/blog', (req,res) => {
  res.render('blog');
});
// /about route
app.get('/about', (req,res) => {
  res.render('about');
});

// For CIT 261
app.get('/cit261', (req,res) => {
  res.render('cit261/index');
});
app.get('/cit261/:topic', (req,res) => {
  try {
    res.render(`cit261/${req.params.topic}`);
  } catch (err) {
    console.error(`An error occured while trying to render cit261/${req.params.topic}:`, err);
    res.render('404');
  }
});

app.get('/ebay', (req,res) => {
  const options = {
    host: 'svcs.ebay.com',
    port: 80,
    path: '/services/search/FindingService/v1?OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=EthanSte-PriceCom-PRD-12466ad44-5e7a466a&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&keywords=harry%20potter%20phoenix&paginationInput.entriesPerPage=2',
    method: 'GET',
    headers: {}
  };
  const url = 'http://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsByKeywords&SERVICE-VERSION=1.0.0&SECURITY-APPNAME=EthanSte-PriceCom-PRD-12466ad44-5e7a466a&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&keywords=harry%20potter%20phoenix&paginationInput.entriesPerPage=2';
  
  const request = http.request(options, resp => {
    let out = '';
    resp.setEncoding('utf8');
    resp.on('data', chunk => out += chunk);
    resp.on('end', () => {
      let obj;
      try {
        obj = JSON.parse(out);
      } catch (err) {
        console.error('Could not parse resp:', err);
        res.send(resp);
      }

      res.send(obj);
    });
  });
  request.on('error', err => console.error(err));
  request.end();
});

// 404 handling - keep as last route
app.use((req,res) => {
  res.status(404).render('404');
});

// Start listening
app.listen(app.get('port'), function() {
  console.log('Portfolio site is running on port ', app.get('port'));
});
