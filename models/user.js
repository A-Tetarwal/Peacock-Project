const mongoose = require('mongoose');

mongoose.connect(`mongodb://127.0.0.1:27017/Peacock`);

const technicalSkillSchema = new mongoose.Schema({
    skill: { type: String, required: true },
    proficiency: { type: Number, required: true }
});

const achievementSchema = new mongoose.Schema({
    achievement: { type: String, required: true },
    description: { type: String, required: true }
});

const projectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    about: { type: String, required: true },
    githublink: { type: String, required: true },
    demo: { type: String }
});

const internshipSchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    duration: { type: String, required: true },
    skillsUsed: { type: String, required: true },
    certificateLink: { type: String }
});

const platformSchema = new mongoose.Schema({
    platform: { type: String, required: true },
    username: { type: String, required: true }
});

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    about: { type: String, required: true },
    institution: { type: String, required: true },
    degree: { type: Number, required: true },
    technicalSkills: [technicalSkillSchema],
    achievements: [achievementSchema],
    projects: [projectSchema],
    internships: [internshipSchema],
    platforms: [platformSchema],
    email: { type: String, required: true, unique: true }
});

console.log('mongodb connected');

const User = mongoose.model('User', userSchema);

module.exports = User;
