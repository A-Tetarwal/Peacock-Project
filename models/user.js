const mongoose = require('mongoose');

mongoose.connect(`mongodb://127.0.0.1:27017/Peacock`);

const technicalSkillSchema = new mongoose.Schema({
    skill: { type: String },
    proficiency: { type: Number }
});

const achievementSchema = new mongoose.Schema({
    achievement: { type: String },
    description: { type: String }
});

const projectSchema = new mongoose.Schema({
    name: { type: String },
    about: { type: String },
    githublink: { type: String },
    demo: { type: String }
});

const internshipSchema = new mongoose.Schema({
    companyName: { type: String },
    duration: { type: String },
    skillsUsed: { type: String },
    certificateLink: { type: String }
});

const platformSchema = new mongoose.Schema({
    platform: { type: String },
    username: { type: String }
});

const userSchema = new mongoose.Schema({
    password: String,
    profilepic: {
        type: String,
        default: 'default.jpg'
    },
    name: { type: String },
    about: { type: String },
    institution: { type: String },
    degree: { type: Number },
    technicalSkills: [technicalSkillSchema],
    achievements: [achievementSchema],
    projects: [projectSchema],
    internships: [internshipSchema],
    platforms: [platformSchema],
    email: { type: String, unique: true }
});

console.log('mongodb connected');

const User = mongoose.model('User', userSchema);

module.exports = User;
