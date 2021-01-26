const express = require('express')
const router = express.Router()
const Notification = require('../models/notification')
const { checkAuthenticated } = require('../authentication/authentication')


router.get('/', checkAuthenticated, async (req, res) => {
    const notifications = await Notification.find({})
    res.render('notification/notification', {
    notifications: notifications  })
    })


router.post('/', async (req, res) => {
    const newNotification = new Notification({
        email: req.body.email,
        message: req.body.message
    })
    try {
        await newNotification.save()
        res.redirect('/')
    } catch {
        res.render('/', {
            errorMessage: 'nie pyklo'
        })
    }
})


router.delete('/', async (req, res) => {
    let notification
    try{
        notification = await Notification.findOne(req.body.email)
        await notification.remove()
        res.redirect('/notification')
    } catch {
        if (notification == null) {
            res.redirect('/employees')
        } else {
            res.redirect('/cars')
        }
    }
})

module.exports = router