if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load()
}

const express = require('express')
const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const { checkAuthenticated, setIsAuthenticated } = require('./authentication/authentication')


const passport = require('passport')
const flash = require('express-flash')
const session = require('express-session')


const indexRouter = require('./routes/index')
const employeeRouter = require('./routes/employees')
const carRouter = require('./routes/cars')
const loginRouter = require('./routes/login')
const notificationRouter = require('./routes/notification')



app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))

app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())


const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

app.use(setIsAuthenticated)
app.use('/', indexRouter)
app.use('/employees', checkAuthenticated, employeeRouter)
app.use('/cars', carRouter)
app.use('/', loginRouter)
app.use('/notification', notificationRouter)

app.listen(process.env.PORT || 3000)