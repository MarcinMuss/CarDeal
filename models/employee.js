const mongoose = require('mongoose')
const Car = require('./car')

const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  surname: {
  type: String,
  required: true
},
  pesel: {
  type: Number,
  required: true
}
})

employeeSchema.pre('remove', function(next) {
  Car.find({ employee: this.id }, (err, cars) => {
    if (err) {
      next(err)
    } else if (cars.length > 0) {
      next(new Error('This employee has cars still'))
    } else {
      next()
    }
  })
})

module.exports = mongoose.model('Employee', employeeSchema)