const express = require('express')
const router = express.Router()
const Streak = require('../models/Streak')
const today = () => new Date().toISOString().split('T')[0]
const yesterday = () => { const d=new Date(); d.setDate(d.getDate()-1); return d.toISOString().split('T')[0] }
router.get('/:code', async (req, res) => {
  try {
    let s = await Streak.findOne({studentCode:req.params.code})
    if(!s) s = await Streak.create({studentCode:req.params.code})
    res.json(s)
  } catch(err) { res.status(500).json({error:err.message}) }
})
router.post('/checkin', async (req, res) => {
  try {
    const {code} = req.body
    if(!code) return res.status(400).json({error:'Code required.'})
    let s = await Streak.findOne({studentCode:code})
    if(!s) s = await Streak.create({studentCode:code})
    const t = today()
    if(s.lastStudyDate===t) return res.json({streak:s,message:'Already checked in today!'})
    s.currentStreak = s.lastStudyDate===yesterday() ? s.currentStreak+1 : 1
    s.lastStudyDate = t
    s.totalDays += 1
    s.longestStreak = Math.max(s.longestStreak,s.currentStreak)
    if(!s.studyDates.includes(t)) s.studyDates.push(t)
    await s.save()
    res.json({streak:s,message:`Day ${s.currentStreak} streak! Keep it up!`})
  } catch(err) { res.status(500).json({error:err.message}) }
})
router.delete('/:code', async (req, res) => {
  try { await Streak.deleteOne({studentCode:req.params.code}); res.json({message:'Reset'}) }
  catch(err) { res.status(500).json({error:err.message}) }
})
module.exports = router
