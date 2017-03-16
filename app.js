// Initial app setup
var express   = require('express'),
    stylus    = require('stylus'),
    buildPath = require('./controllers/utility.js').buildPath
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
  const keywordsParam = req.query.keywords;
  // TODO: Return error object?
  if (keywordsParam === undefined || keywordsParam === '') {
    res.send({});
    return;
  }
  const paginateParam = req.query.pagination !== undefined && req.query.pagination !== 'false';
  const entryParam = req.query.entryCount;

  const url = `http://svcs.ebay.com${buildPath(keywordsParam, paginateParam, entryParam)}`;
  
  // Tears of joy for async/await. Praise be to Node 7
  (async() => {
    try {
      const resp = await fetch(url);
      const data = await resp.json();
      res.send({data, msg: 'Here we are'});
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
