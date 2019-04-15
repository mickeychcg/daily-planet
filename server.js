var express = require('express');
var fs = require('fs');
var methodOverride = require('method-override');
var app = express();

app.set('view engine', 'ejs');
app.use(express.static('static'));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

// Check to see if express and ejs are running
app.get('/', function (req, res) {
  res.send('Is this thing on?');
});

// gets all the articles
app.get('/articles', function (req, res) {
  var articles = fs.readFileSync('./articles.json');
  articles = JSON.parse(articles);
  console.log(articles);
  res.render('articles/index', { myArticles: articles });
});
// GET method to add a new article
app.get('/articles/new', function (req, res) {
  res.render('articles/new');
});

// POST articles from a data source
app.post('/articles', function (req, res) {
  var articles = fs.readFileSync('./articles.json');
  articles = JSON.parse(articles);
  articles.push(req.body);
  console.log("this is the articles", articles);
  fs.writeFileSync('./articles.json', JSON.stringify(articles));
  res.redirect('/articles')
});

// GET one article by ID
app.get('/articles/:id', function (req, res) {
  var articles = fs.readFileSync('./articles.json');
  var articlesData = JSON.parse(articles);
  var articlesIndex = parseInt(req.params.id);
  res.render('articles/show', { myArticle: articlesData[articlesIndex] })
});

// Delete an article by ID
app.delete('/articles/:id', function (req, res) {
  var articles = fs.readFileSync('./articles.json');
  articles = JSON.parse(articles);
  articles.splice(parseInt(req.params.id), 1);
  fs.writeFileSync('./articles.json', JSON.stringify(articles));
  res.redirect('/articles');
})

// get each member of the array to be able to edit it
app.get('/articles/:id/edit', function (req, res) {
  var articles = fs.readFileSync('./articles.json');
  articles = JSON.parse(articles);
  var articleIndex = parseInt(req.params.id);
  res.render('articles/edit', { articles: articles[articleIndex], articleId: articleIndex });
});

//  PUT route to add the new?
app.put('/articles/:id', function (req, res) {
  var articles = fs.readFileSync('./articles.json');
  articles = JSON.parse(articles);
  var articleId = parseInt(req.params.id);
  articles[articleId].name = req.body.name;
  articles[articleId].type = req.body.type;
  fs.writeFileSync('./articles.json', JSON.stringify(articles));
  res.redirect('/articles/' + articleId);
})


app.listen(3000);
