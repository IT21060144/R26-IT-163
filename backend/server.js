const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
const fs = require('fs')
require('dotenv').config()
const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/student', require('./routes/student'))
app.use('/api/results', require('./routes/results'))
app.use('/api/streak',  require('./routes/streak'))
app.get('/api', (req,res) => res.json({status:'StudyTrack API running'}))

const frontendDist = path.join(__dirname, '..', 'frontend', 'dist')
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist))
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Not Found' })
    res.sendFile(path.join(frontendDist, 'index.html'))
  })
}

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB error:', err.message))
const PORT = process.env.PORT || 5002
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`))
