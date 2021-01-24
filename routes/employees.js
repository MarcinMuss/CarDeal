const express = require('express')
const router = express.Router()
const Employee = require('../models/employee')
const Car = require('../models/car')

// All Employees Route
router.get('/', async (req, res) => {
  let search = {};
  if (req.query.name != null && req.query.name !== '') {
    const searchTerm = new RegExp(req.query.name, 'i')
    search.$or = [{ 'name': searchTerm }, { 'surname': searchTerm }];
  }
  try {
    const employees = await Employee.find(search)
    res.render('employees/index', {
      employees: employees,
      searchOptions: req.query
    })
  } catch {
    res.redirect('/')
  }
})

// New Employee Route
router.get('/new', (req, res) => {
  res.render('employees/new', { employee: new Employee() })
})

// Create Employee Route
router.post('/', async (req, res) => {
  const employee = new Employee({
    name: req.body.name,
    surname: req.body.surname,
    pesel: req.body.pesel
  })
  try {
    const newEmployee = await employee.save()
    res.redirect(`employees/${newEmployee.id}`)
  } catch {
    res.render('employees/new', {
      employee: employee,
      errorMessage: 'Error creating Employee'
    })
  }
})

// ID Employee Route
router.get('/:id', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
    const cars = await Car.find({ employee: employee.id }).limit(6).exec()
    res.render('employees/show', {
      employee: employee,
      carsByEmployee: cars
    })
  } catch {
    res.redirect('/')
  }
})

// Edit Employee Route
router.get('/:id/edit', async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id)
    res.render('employees/edit', { employee: employee })
  } catch {
    res.redirect('/employees')
  }
})

router.put('/:id', async (req, res) => {
  let employee
  try {
    employee = await Employee.findById(req.params.id)
    employee.name = req.body.name
    employee.surname = req.body.surname
    employee.pesel = req.body.pesel
    await employee.save()
    res.redirect(`/employees/${employee.id}`)
  } catch {
    if (employee == null) {
      res.redirect('/')
    } else {
      res.render('employees/edit', {
        employee: employee,
        errorMessage: 'Error updating Employee'
      })
    }
  }
})

// Delete Employee Route
router.delete('/:id', async (req, res) => {
  let employee
  try {
    employee = await Employee.findById(req.params.id)
    await employee.remove()
    res.redirect('/employees')
  } catch {
    if (employee == null) {
      res.redirect('/')
    } else {
      res.redirect(`/employees/${employee.id}`)
    }
  }
})

module.exports = router