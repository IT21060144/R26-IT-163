const express = require('express')
const router = express.Router()
const Result = require('../models/Result')
router.get('/:code', async (req, res) => {
  try { res.json(await Result.find({studentCode:req.params.code}).sort({createdAt:-1}).limit(20)) }
  catch(err) { res.status(500).json({error:err.message}) }
})
router.post('/', async (req, res) => {
  try { res.status(201).json(await Result.create(req.body)) }
  catch(err) { res.status(500).json({error:err.message}) }
})
router.delete('/:code', async (req, res) => {
  try { await Result.deleteMany({studentCode:req.params.code}); res.json({message:'Cleared'}) }
  catch(err) { res.status(500).json({error:err.message}) }
})
module.exports = router
