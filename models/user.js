const mongoose = require('mongoose');
const { type } = require('os');

// mongoose.connect(`mongodb://127.0.0.1:27017/Peacock`);
// Connect to MongoDB Atlas
// mongoose.connect('mongodb+srv://A-Tetarwal:koWexXCQvx7O7Eqi@cluster0.km9ovrx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0').then(() => {
//     console.log('Connected to MongoDB Atlas');
// }).catch((err) => {
//     console.error('Error connecting to MongoDB Atlas:', err.message);
// });

mongoose.connect('mongodb+srv://andashishwill:QQEoVJXrlzlXZ5tj@peacock-project.qxukkft.mongodb.net/?retryWrites=true&w=majority&appName=Peacock-Project'
).then(() => {
  console.log('Connected to MongoDB Atlas');
}).catch(err => {
  console.error('Error connecting to MongoDB Atlas:', err.message);
});

const userSchema = new mongoose.Schema({
    name: { type: String, default: '' },
    oneliner: { type: String, default: '' },
    about: { type: String, default: '' },
    institution: { type: String, default: '' },
    grades: { type: String, default: '' },
    technicalSkills: [{
      skill: { type: String, default: '' },
      proficiency: { type: Number, default: null }
    }],
    achievements: [{
      achievement: { type: String, default: '' },
      description: { type: String, default: '' }
    }],
    projects: [{
      projectpic: {type: String, default: 'projectdefault.jpg'},
      projectName: { type: String, default: '' },
      projectAbout: { type: String, default: '' },
      githublink: { type: String, default: '' },
      demo: { type: String, default: '' }
    }],
    internships: [{
      internshipCompany: { type: String, default: '' },
      internshipDuration: { type: String, default: '' },
      internshipSkills: { type: String, default: '' },
      internshipCertificate: { type: String, default: '' }
    }],
    platforms: [{
      platform: { type: String, default: '' },
      username: { type: String, default: '' }
    }],
    email: { type: String, required: true },
    password: { type: String, required: true },
    profilepic: { type: String, default: 'default.jpg' },
    resume: { type: String, default: 'default.pdf' }
  });
  
console.log('mongodb connected');

const User = mongoose.model('User', userSchema);

module.exports = User;
