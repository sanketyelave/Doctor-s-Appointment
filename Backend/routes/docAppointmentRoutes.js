const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const Doctor = require('../models/doctormodel')
const Appointment = require('../models/appointmentmodel')
const jwt = require('jsonwebtoken')
require("dotenv").config();

const requireAuth = async (req,res,next)=>{

    const { authorization } = req.headers
    if(!authorization){
        return res.status(401).json({error:'Authorization token required'})
    }

    const token = authorization.split(' ')[1]

    try{
        const {_id}= jwt.verify(token,process.env.SECRET)
        req.doctor = await Doctor.findOne({_id}).select('_id')
        next()
    }catch{
       console.log(error)
       res.status(400).json({error:'Request is not authorized'})
    }
}

const myAppointments = async(req,res)=>{
    const { doctor_id, day, time } = req.body
    if (!mongoose.Types.ObjectId.isValid(doctor_id)) {
        return res.status(404).json({ error: "no such doctor" });
    }
    try {
        const appointments = await Appointment.find({doctor_id:doctor_id, day:day, time:time })
        res.status(200).json(appointments)
    } catch (error) {
        res.status(400).json(error.message);
    }
}

const delayAppointments = async(req,res)=>{
    const{ doctor_id,day,time,delay } = req.body
    if (!mongoose.Types.ObjectId.isValid(doctor_id)) {
        return res.status(404).json({ error: "no such doctor" });
    }
    try {
        const appointments = await Appointment.find({doctor_id:doctor_id, day:day, time:time })
        appointments.map((appointment)=>{
            appointment.delay=delay;
        })
        res.status(200).json(appointments)
    } catch (error) {
        res.status(400).json(error.message);
    }
}
const cancelAppointments = async(req,res)=>{
    const{ doctor_id,day,time } = req.body
    if (!mongoose.Types.ObjectId.isValid(doctor_id)) {
        return res.status(404).json({ error: "no such doctor" });
    }
    try {
        const appointments = await Appointment.find({doctor_id:doctor_id, day:day, time:time })
        appointments.map(async(appointment)=>{
            await Appointment.findByIdAndDelete(appointment._id).save()
        })
        res.status(200).json(appointments)
    } catch (error) {
        res.status(400).json(error.message);
    }
}

router.use(requireAuth)

router.get('/appointments',myAppointments)
router.patch('/delayAppointments',delayAppointments)
router.delete('/cancelAppointments',cancelAppointments)

module.exports = router;