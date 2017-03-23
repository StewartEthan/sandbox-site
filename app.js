// Initial app setup
var express   = require('express'),
    stylus    = require('stylus'),
    buildUrl = require('./controllers/utility.js').buildUrl
    fetch     = require('node-fetch');

var app = express();

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
  const keywordsParam = req.query.query;
  
  if (keywordsParam === undefined || keywordsParam === '') {
    res.send({error: true, msg: 'Please specify a query!'});
    return;
  }

  const limitParam = req.query.limitResults !== undefined && req.query.limitResults !== 'false';
  const entryParam = req.query.maxEntries;

  const url = buildUrl(keywordsParam, limitParam, entryParam);
  
  // Tears of joy for async/await. Praise be to Node 7
  (async() => {
    try {
      const resp = await fetch(url);
      const data = await resp.json();

      // TODO: Add price array to data
      res.send(data);
    } catch (err) {
      res.send(`Error while fetching ${url}:`, err);
    }
  })();
});

app.get('/walmart', (req,res) => {
  res.header('Access-Control-Allow-Origin', '*');

  // API key, search query
  const url = `http://api.walmartlabs.com/v1/search?apiKey=${req.query.apiKey}&query=${req.query.query}`;

  (async() => {
    try {
      const resp = await fetch(url);
      const data = await resp.json();
      res.send(data);
    } catch (err) {
      res.send(`Error while fetching ${url}:`, err);
    }
  })();
});

app.get('/ebay/details', (req,res) => {
  const id = req.query.id;
  if ((typeof id !== 'string' && typeof id !== 'number') || id === '') {
    res.send({error: true, msg: 'Invalid product reference ID. Product reference IDs must be in numeric format.'});
    return;
  }

  const url = `
    http://svcs.ebay.com/services/search/FindingService/v1?OPERATION-NAME=findItemsByProduct&SERVICE-VERSION=1.12.0&SECURITY-APPNAME=EthanSte-PriceCom-PRD-12466ad44-5e7a466a&RESPONSE-DATA-FORMAT=JSON&REST-PAYLOAD&paginationInput.entriesPerPage=10&productId.@type=ReferenceID&productId=${id}`;
  
  (async() => {
    try {
      const resp = await fetch(url);
      const data = await resp.json();
      res.send(data.findItemsByProductResponse[0]);
    } catch (err) {
      res.send(`Error while fetching ${url}:`, err);
    }
  })();
});

// 404 handling - keep as last route
app.use((req,res) => {
  res.status(404).render('404');
});

// Start listening
app.listen(app.get('port'), function() {
  console.log('Portfolio site is running on port ', app.get('port'));
});
