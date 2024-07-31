const mongoose = require('mongoose');

mongoose.connect(`mongodb://127.0.0.1:27017/Peacock`);

const userSchema = new mongoose.Schema({
    name: { type: String, default: '' },
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
    profilepic: { type: String, default: 'default.jpg' }
  });
  
console.log('mongodb connected');

const User = mongoose.model('User', userSchema);

module.exports = User;
