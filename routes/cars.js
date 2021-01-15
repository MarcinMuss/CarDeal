const express = require('express')
const router = express.Router()
const Car = require('../models/car')
const Employee = require('../models/employee')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']

// All Cars Route
router.get('/', async (req, res) => {
  let query = Car.find()
  if (req.query.title != null && req.query.title != '') {
    query = query.regex('title', new RegExp(req.query.title, 'i'))
  }
  if (req.query.publishedBefore != null && req.query.publishedBefore != '') {
    query = query.lte('yearOfProduction', req.query.publishedBefore)
  }
  if (req.query.publishedAfter != null && req.query.publishedAfter != '') {
    query = query.gte('yearOfProduction', req.query.publishedAfter)
  }
  try {
    const cars = await query.exec()
    res.render('cars/index', {
      cars: cars,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})

// New Car Route
router.get('/new', async (req, res) => {
  renderNewPage(res, new Car())
})

// Create Car Route
router.post('/', async (req, res) => {
  const car = new Car({
    title: req.body.title,
    employee: req.body.employee,
    yearOfProduction: new Date(req.body.yearOfProduction),
    price: req.body.price,
    brand: req.body.brand,
    modell: req.body.modell,
    mileage: req.body.mileage,
    typeOfFuel: req.body.typeOfFuel,
    capacity: req.body.capacity,
    power: req.body.power,
    gearbox: req.body.gearbox,
    drive: req.body.drive,
    country: req.body.country,
    registeredInPoland: req.body.registeredInPoland,
    firstOwner: req.body.firstOwner,
    notCrashed: req.body.notCrashed,
    english: req.body.english,
    vin: req.body.vin,
    description: req.body.description
  })
  saveCover(car, req.body.cover)

  try {
    const newCar = await car.save()
    res.redirect(`cars/${newCar.id}`)
  } catch {
    renderNewPage(res, car, true)
  }
})

// Show Car Route
router.get('/:id', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id)
                           .populate('employee')
                           .exec()
    res.render('cars/show', { car: car })
  } catch {
    res.redirect('/')
  }
})

// Edit Car Route
router.get('/:id/edit', async (req, res) => {
  try {
    const car = await Car.findById(req.params.id)
    renderEditPage(res, car)
  } catch {
    res.redirect('/')
  }
})

// Update Car Route
router.put('/:id', async (req, res) => {
  let car
  try {
    car = await Car.findById(req.params.id)
    car.title = req.body.title
    car.employee = req.body.employee
    car.yearOfProduction = new Date(req.body.yearOfProduction)
    car.price = req.body.price
    car.brand = req.body.brand
    car.modell = req.body.modell
    car.mileage = req.body.mileage
    car.typeOfFuel = req.body.typeOfFuel
    car.capacity = req.body.capacity
    car.power = req.body.power
    car.gearbox = req.body.gearbox
    car.drive = req.body.drive
    car.country = req.body.country
    car.registeredInPoland = req.body.registeredInPoland
    car.firstOwner = req.body.firstOwner
    car.notCrashed = req.body.notCrashed
    car.english = req.body.english
    car.vin = req.body.vin
    car.description = req.body.description
    if (req.body.cover != null && req.body.cover !== '') {
      saveCover(car, req.body.cover)
    }
    await car.save()
    res.redirect(`/admin/cars/${car.id}`)
  } catch {
    if (car != null) {
      renderEditPage(res, car, true)
    } else {
      redirect('/')
    }
  }
})

// Delete Car Page
router.delete('/:id', async (req, res) => {
  let car
  try {
    car = await Car.findById(req.params.id)
    await car.remove()
    res.redirect('/admin/cars')
  } catch {
    if (car != null) {
      res.render('cars/show', {
        car: car,
        errorMessage: 'Could not remove car'
      })
    } else {
      res.redirect('/')
    }
  }
})

async function renderNewPage(res, car, hasError = false) {
  renderFormPage(res, car, 'new', hasError)
}

async function renderEditPage(res, car, hasError = false) {
  renderFormPage(res, car, 'edit', hasError)
}

async function renderFormPage(res, car, form, hasError = false) {
  try {
    const employees = await Employee.find({})
    const params = {
      employees: employees,
      car: car
    }
    if (hasError) {
      if (form === 'edit') {
        params.errorMessage = 'Error Updating Car'
      } else {
        params.errorMessage = 'Error Creating Car'
      }
    }
    res.render(`cars/${form}`, params)
  } catch {
    res.redirect('/admin/cars')
  }
}

function saveCover(car, coverEncoded) {
  if (coverEncoded == null) return
  const cover = JSON.parse(coverEncoded)
  if (cover != null && imageMimeTypes.includes(cover.type)) {
    car.coverImage = new Buffer.from(cover.data, 'base64')
    car.coverImageType = cover.type
  }
}

module.exports = router