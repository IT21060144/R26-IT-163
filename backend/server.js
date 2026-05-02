const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const path = require('path')
const fs = require('fs')
require('dotenv').config({ path: path.join(__dirname, '.env') })
const app = express()
app.use(cors())
app.use(express.json())
app.use('/api/student', require('./routes/student'))
app.use('/api/results', require('./routes/results'))
app.use('/api/streak',  require('./routes/streak'))
app.get('/api', (req, res) => {
  const mongoOk = mongoose.connection.readyState === 1
  res.json({
    status: 'StudyTrack API running',
    mongo: mongoOk ? 'connected' : 'not connected',
    database: mongoOk ? mongoose.connection.name : null,
  })
})

const frontendDist = path.join(__dirname, '..', 'frontend', 'dist')
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist))
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'Not Found' })
    res.sendFile(path.join(frontendDist, 'index.html'))
  })
}

const PORT = process.env.PORT || 5002

async function start() {
  const uri = (process.env.MONGO_URI || '').trim()
  if (!uri) {
    console.error('Missing MONGO_URI. Add it to backend/.env (MongoDB Atlas connection string).')
    process.exit(1)
  }
  try {
    console.log('Connecting to MongoDB...')
    await mongoose.connect(uri)
  } catch (err) {
    console.error('MongoDB connection failed:', err.message)
    console.error('If you use Atlas: Network Access → add your current IP (or 0.0.0.0/0 for dev).')
    process.exit(1)
  }
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
    console.log(`MongoDB: connected — database "${mongoose.connection.name}"`)
  })
}

start()
