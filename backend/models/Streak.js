const mongoose = require('mongoose')
const S = new mongoose.Schema({ studentCode: { type: String, required: true, unique: true }, lastStudyDate: { type: String, default: '' }, currentStreak: { type: Number, default: 0 }, longestStreak: { type: Number, default: 0 }, totalDays: { type: Number, default: 0 }, studyDates: [String] })
module.exports = mongoose.model('Streak', S)
