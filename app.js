const express = require('express');
const path = require('path');
const session = require('express-session');
const serverless = require('serverless-http');

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Define routes
app.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

// Session middleware
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));

app.post('/name', (req, res) => {
  const name = req.body.name;
  req.session.name = name;
  res.redirect('/main');
});

app.get('/main', (req, res) => {
  const name = req.session.name;
  res.render('main', { name });
});

app.get('/forefront', (req, res) => {
  res.render('forefront');
});

app.post('/forefront', (req, res) => {
  req.session.formData = req.body;
  res.redirect('builder');
});

app.get('/builder', (req, res) => {
  console.log(req.session.formData);
  res.render('builder', { formData: req.session.formData });
});

// Export the app for Vercel
module.exports = app;
module.exports.handler = serverless(app);

app.listen(port, () => console.log(`server running on port ${port}`))