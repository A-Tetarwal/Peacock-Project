const { name } = require('ejs');
const express = require('express');
const path = require('path');
const session = require('express-session')

const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Define routes
app.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});


// session middle ware
app.use(session({ secret: 'secret' }));

app.post('/name', (req, res) => {
  const name = req.body.name;
  req.session.name = name;
  res.redirect('/main');
})

app.get('/main', (req, res) => {
  const name = req.session.name;
  res.render('main', { name });
})

app.get('/builder', (req, res) => {
  res.render("builder", {name})
})

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
