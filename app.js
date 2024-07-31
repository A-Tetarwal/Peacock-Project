const express = require('express');
const path = require('path');
const session = require('express-session');
const serverless = require('serverless-http');

const app = express();
const port = process.env.PORT || 3000;

const userModel = require(`./models/user`);

const cookieParser = require('cookie-parser')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// multeconfig import kr rhe hain
const upload = require('./configs/multerconfig');


// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

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

// const multer = require('multer');
// const upload = multer(); // or your multer configuration

app.use((req, res, next) => {
  console.log('Middleware check:', req.method, req.url);
  next();
});

// Function to normalize arrays to handle single and multiple inputs
const normalizeArray = (input) => Array.isArray(input) ? input : [input];

// Function to extract dynamic fields
const extractDynamicFields = (prefix, body) => {
  const result = [];
  let index = 1;
  while (true) {
    const item = {};
    let hasData = false;
    for (const key in body) {
      if (key.startsWith(`${prefix}_${index}`)) {
        const fieldName = key.split('_')[0];
        item[fieldName] = body[key];
        hasData = true;
      }
    }
    if (!hasData) break;
    result.push(item);
    index++;
  }
  return result;
};

app.post('/builder', upload.single('image'), async (req, res) => {
  req.session.formData = req.body;
  console.log(req.session.formData);

  const {
      name,
      about,
      institution,
      grades,
      email,
      password,
  } = req.body;

  const skill = normalizeArray(req.body.skill);
  const proficiency = normalizeArray(req.body.proficiency);
  const achievement = normalizeArray(req.body.achievement);
  const description = normalizeArray(req.body.description);

  const technicalSkills = skill.map((s, index) => ({
      skill: s,
      proficiency: proficiency[index] || null,
  }));

  const achievements = achievement.map((a, index) => ({
      achievement: a,
      description: description[index] || '',
  }));

  const projects = extractDynamicFields('project', req.body);
  const internships = extractDynamicFields('internship', req.body);

  // Parse platforms data from flat structure
  const platforms = [];
  let i = 0;
  while (req.body[`platforms[${i}]`]) {
      platforms.push({
          platform: req.body[`platforms[${i}].platform`],
          username: req.body[`platforms[${i}].username`]
      });
      i++;
  }

  const user = new userModel({
      name,
      about,
      institution,
      grades,
      email,
      password,
      technicalSkills,
      achievements,
      projects,
      internships,
      platforms,  // Save platforms data
  });

  await user.save();
  console.log(user);

  res.send('/success');
});




// Export the app for Vercel
module.exports = app;
module.exports.handler = serverless(app);

app.listen(port, () => console.log(`server running on port ${port}`))