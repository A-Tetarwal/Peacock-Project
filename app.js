const express = require('express');
const path = require('path');
const session = require('express-session');
const serverless = require('serverless-http');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const upload = require('./configs/multerconfig');
const userModel = require('./models/user');  // Ensure the correct model is imported


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

app.post('/builder', upload.any(), async (req, res) => {
  const formData = req.body;
  const files = req.files;
  console.log('Middleware check: POST /builder');
  console.log('Received formData:', formData);
  console.log('Received files:', files);

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
          profilepic: files.find(file => file.fieldname === 'profilepic')?.path.replace('public', '') || 'default.jpg',
          resume: files.find(file => file.fieldname === 'resume')?.filename || 'default.pdf'
        };

        // Process technical skills
        if (Array.isArray(formData.technicalSkills)) {
          user.technicalSkills = formData.technicalSkills.map(skillObj => ({
            skill: skillObj.skill || '',
            proficiency: Number(skillObj.proficiency) || null
          }));
        }

        // Process achievements
        if (Array.isArray(formData.achievements)) {
          user.achievements = formData.achievements.map(achievementObj => ({
            achievement: achievementObj.achievement || '',
            description: achievementObj.description || ''
          }));
        }

        // Process projects
        let i = 1;
        while (formData[`projectName_${i}`]) {
          // Find the image for this project
          const projectImageFile = files.find(file => file.fieldname === `projectpic_${i}`);
          user.projects.push({
            projectName: formData[`projectName_${i}`],
            projectAbout: formData[`projectAbout_${i}`] || '',
            githublink: formData[`githublink_${i}`] || '',
            demo: formData[`demo_${i}`] || '',
            projectpic: projectImageFile ? projectImageFile.path.replace('public', '') : 'projectdefault.jpg'
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
    res.redirect(`/portfolio/${newUser.name}`);
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

app.get('/portfolio/edit/:name', async (req, res) => {
  const user = await userModel.findOne({ name: req.params.name });
  res.render('edit', {user})
})

app.post('/edit/:name', upload.any(), async (req, res) => {
  try {
    console.log('Received form data:', req.body);

    // Find the user by name
    const user = await userModel.findOne({ name: req.params.name });
    const files = req.files;

    // Check if user exists
    if (!user) {
      return res.status(404).send('User not found');
    }

    // Update user fields with the form data
    user.name = req.body.name || user.name;
    user.oneliner = req.body.oneliner || user.oneliner;
    user.about = req.body.about || user.about;
    user.institution = req.body.institution || user.institution;
    user.grades = req.body.grades || user.grades;

    // Update technical skills
    if (Array.isArray(req.body.technicalSkills)) {
      user.technicalSkills = req.body.technicalSkills.map(skillObj => ({
        skill: skillObj.skill || '',
        proficiency: Number(skillObj.proficiency) || null
      }));
    }

    // Update achievements
    if (Array.isArray(req.body.achievements)) {
      user.achievements = req.body.achievements.map(achievementObj => ({
        achievement: achievementObj.achievement || '',
        description: achievementObj.description || ''
      }));
    }

    // Update projects
    if (Array.isArray(req.body.projects)) {
      user.projects = req.body.projects.map((project, index) => {
        const projectImageFile = files.find(file => file.fieldname === `projectpic_${index}`);
        const existingProject = user.projects[index] || {}; // Use existing project if available
        return {
          projectName: project.projectName || '',
          projectAbout: project.projectAbout || '',
          githublink: project.githublink || '',
          demo: project.demo || '',
          projectpic: projectImageFile ? projectImageFile.path.replace('public', '') : existingProject.projectpic
        };
      });
    }

    // Update internships
    if (Array.isArray(req.body.internships)) {
      user.internships = req.body.internships.map(internship => ({
        internshipCompany: internship.internshipCompany || '',
        internshipDuration: internship.internshipDuration || '',
        internshipSkills: internship.internshipSkills || '',
        internshipCertificate: internship.internshipCertificate || ''
      }));
    }

    // Update platforms
    if (Array.isArray(req.body.platforms)) {
      user.platforms = req.body.platforms.map(platform => ({
        platform: platform.platform || '',
        username: platform.username || ''
      }));
    }

    // Update contact info
    user.email = req.body.email || user.email;
    
    // Update password (ensure proper hashing if necessary)
    user.password = req.body.password || user.password;

    // Handle file upload if new files are provided
    files.forEach(file => {
      if (file.fieldname === 'profilepic') {
        user.profilepic = file.path.replace('public', ''); // Update profile picture path
        console.log('Updated profile picture:', user.profilepic);
      } else if (file.fieldname === 'resume') {
        user.resume = file.filename; // Update resume filename
        console.log('Updated resume:', user.resume);
      }
    });
       

    // Save the updated user
    await user.save();

    console.log('User updated successfully:', user);

    // Redirect to the portfolio page
    res.redirect(`/portfolio/${req.params.name}`);
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).send('Server Error');
  }
});

// Route to serve the resume file
app.get('/download-resume/:filename', (req, res) => {
  const filename = req.params.filename;
  const resumePath = path.join(__dirname, 'public/documents', filename);
  res.download(resumePath, (err) => {
    if (err) {
      console.error('Error downloading file:', err);
      res.status(404).send('File not found');
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// Export the app for Vercel
module.exports = app;
module.exports.handler = serverless(app);
