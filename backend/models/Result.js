const mongoose = require('mongoose')
const S = new mongoose.Schema({ studentCode: { type: String, required: true }, scores: { HTS: Number, SIS: Number, GCS: Number, QPS: Number, PS: Number }, answers: [Number], createdAt: { type: Date, default: Date.now } })
module.exports = mongoose.model('Result', S)
