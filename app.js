const express = require('express');
const path = require('path');
const session = require('express-session');
const serverless = require('serverless-http');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const upload = require('./configs/multerconfig');
const userModel = require('./models/user');  // Ensure the correct model is imported
const { platform } = require('os');


const app = express();
const port = process.env.PORT || 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Set the view engine to EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Session middleware
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));

// Middleware to log requests
app.use((req, res, next) => {
  console.log('Middleware check:', req.method, req.url);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.render('index', { title: 'Home' });
});

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

app.post('/builder', upload.single('image'), async (req, res) => {
  const formData = req.body;
  console.log('Middleware check: POST /builder');
  console.log('Received formData:', formData);

  try {
    // Function to create a new user
    const createUser = async (formData) => {
      try {
        // Parse formData
        const user = {
          name: formData.name || '',
          oneliner: formData.oneliner || '',
          about: formData.about || '',
          institution: formData.institution || '',
          grades: formData.grades || '',
          technicalSkills: [],
          achievements: [],
          projects: [],
          internships: [],
          platforms: [],
          email: formData.email,
          password: formData.password,
          profilepic: formData.profilepic || 'default.jpg'
        };

        // Process technical skills
        if (Array.isArray(formData.skill) && Array.isArray(formData.proficiency)) {
          user.technicalSkills = formData.skill.map((s, index) => ({
            skill: s,
            proficiency: Number(formData.proficiency[index]) || null
          }));
        }

        // Process achievements
        if (formData.achievement && formData.description) {
          user.achievements.push({
            achievement: formData.achievement,
            description: formData.description
          });
        }

        // Process projects
        let i = 1;
        while (formData[`projectName_${i}`]) {
          user.projects.push({
            projectName: formData[`projectName_${i}`],
            projectAbout: formData[`projectAbout_${i}`] || '',
            githublink: formData[`githublink_${i}`] || '',
            demo: formData[`demo_${i}`] || ''
          });
          i++;
        }

        // Process internships
        let j = 1;
        while (formData[`internshipCompany_${j}`]) {
          user.internships.push({
            internshipCompany: formData[`internshipCompany_${j}`],
            internshipDuration: formData[`internshipDuration_${j}`] || '',
            internshipSkills: formData[`internshipSkills_${j}`] || '',
            internshipCertificate: formData[`internshipCertificate_${j}`] || ''
          });
          j++;
        }

        // Process platforms
        let k = 0;
        while (formData[`platforms[${k}].username`]) {
          user.platforms.push({
            platform: formData[`platforms[${k}].platform`] || '',
            username: formData[`platforms[${k}].username`] || ''
          });
          k++;
        }

        // Create the user
        const newUser = new userModel(user);
        await newUser.save();
        console.log('User created successfully:', newUser);

        return newUser;
      } catch (error) {
        console.error('Error creating user:', error);
        throw error;
      }
    };

    // Create a new user with the form data
    const newUser = await createUser(formData);

    // Send a response
    // res.status(200).send({ message: 'User created successfully', user: newUser });
    res.redirect(`/portfolio/${newUser.name}`,{ user:newUser });
  } catch (error) {
    // Ensure only one response is sent
    if (!res.headersSent) {
      res.status(500).send({ message: 'Error creating user', error: error.message });
    }
  }
});

app.get('/portfolio/:name', async (req, res) => {
  try {
    // Find user by name
    const user = await userModel.findOne({ name: req.params.name });

    if (!user) {
      return res.status(404).send('User not found');
    }

    // Render the portfolio page with user data
    res.render('portfolio', { user });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).send({ message: 'Error fetching user', error: error.message });
  }
});


app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// Export the app for Vercel
module.exports = app;
module.exports.handler = serverless(app);
