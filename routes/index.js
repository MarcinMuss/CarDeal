const express = require('express')
const router = express.Router()
const Car = require('../models/car')
const { checkAuthenticated } = require('../authentication/authentication')

router.get('/', async (req, res) => {
  let query = Car.find()
  if (req.query.title != null && req.query.title != '') {
    query = query.regex('title', new RegExp(req.query.title, 'i'))
  }
  if (req.query.mileageless != null && req.query.mileageless != '') {
    query = query.lte('mileage', req.query.mileageless)
  }
  if (req.query.priceless != null && req.query.priceless != '') {
    query = query.lte('price', req.query.priceless)
  }
  try {
    const cars = await query.exec()
    res.render('index', {
      cars: cars,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
  // let cars
  // try {
  //   cars = await Car.find().sort({ createdAt: 'desc' }).limit(10).exec()
  // } catch {
  //   cars = []
  // }
  // res.render('index', { cars: cars })
})

router.get('', checkAuthenticated, async (req, res) => {
  let cars
  try {
    cars = await Car.find().sort({ createdAt: 'desc' }).limit(10).exec()
  } catch {
    cars = []
  }
  res.render('index', { cars: cars })
})

module.exports = router