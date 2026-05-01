const express = require('express')
const router = express.Router()
const Student = require('../models/Student')
function genCode() { const L='ABCDEFGHJKLMNPQRSTUVWXYZ'; return `ST-${L[Math.floor(Math.random()*L.length)]}${Math.floor(1000+Math.random()*9000)}` }
router.post('/new', async (req, res) => {
  try {
    let code, exists, t=0
    do { code=genCode(); exists=await Student.findOne({code}); t++ } while(exists&&t<10)
    await Student.create({code})
    res.status(201).json({code})
  } catch { res.status(201).json({code:genCode()}) }
})
router.post('/verify', async (req, res) => {
  try {
    const code=(req.body.code||'').trim().toUpperCase()
    if(!code) return res.status(400).json({error:'Code required.'})
    await Student.findOneAndUpdate({code},{code},{upsert:true,new:true})
    res.json({code,valid:true})
  } catch(err) { res.status(500).json({error:err.message}) }
})
module.exports = router
