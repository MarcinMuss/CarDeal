const mongoose = require('mongoose')

const carSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  brand: {
    type: String,
    
  },
  modell: {
    type: String,
    
  },
  yearOfProduction: {
    type: Date,
    required: true
  },
  mileage: {
    type: Number,
    
  },
  typeOfFuel: {
    type: String,
    
  },
  capacity: {
    type: Number,
    
  },
  power: {
    type: Number,
    
  },
  gearbox: {
    type: String,
    
  },
  drive: {
    type: String,
    
  },
  country: {
    type: String,
    
  },
  registeredInPoland: {
    type: String,
    
  },
  firstOwner: {
    type: String,
    
  },
  notCrashed: {
    type: String,
    
  },
  english: {
    type: String,
    
  },
  vin: {
    type: Number,
    
  },
  description: {
    type: String
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  coverImages: {
    type: Array
  },
  coverImageType: {
    type: String,
    required: true
  },
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Employee'
  }
})

carSchema.virtual('coverImagePaths').get(function () {
  if (this.coverImages != null && this.coverImageType != null) {
    return this.coverImages.map(coverImage => `data:${this.coverImageType};charset=utf-8;base64,${coverImage.toString('base64')}`)
  }
})

module.exports = mongoose.model('Car', carSchema)