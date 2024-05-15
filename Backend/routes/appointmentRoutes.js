const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const jwt = require('jsonwebtoken')
const Patient = require('../models/patientmodel')
const Appointment = require('../models/appointmentmodel')
const AverageTime = require('../AverageTime.js')
require("dotenv").config();

const requireAuth = async (req, res, next) => {

    const { authorization } = req.headers
    if (!authorization) {
        return res.status(401).json({ error: 'Authorization token required' })
    }

    const token = authorization.split(' ')[1]

    try {
        const { _id } = jwt.verify(token, process.env.SECRET)
        req.patient = await Patient.findOne({ _id }).select('_id')
        next()
    } catch {
        console.log(error)
        res.status(400).json({ error: 'Request is not authorized' })
    }
}

function Timedifference(timeRange) {
    if (!timeRange || typeof timeRange !== 'string' || !timeRange.includes('-')) {
        console.error('Invalid time range format');
        return null;
    }
    const [startTime, endTime] = timeRange.split('-').map(time => time.trim());
    if (!startTime || !endTime) {
        console.error('Invalid start time or end time');
        return null;
    }

    const [startHour, startMinute] = startTime.split(/:|\s/).map(part => parseInt(part, 10));
    const [endHour, endMinute] = endTime.split(/:|\s/).map(part => parseInt(part, 10));
    if (isNaN(startHour) || isNaN(startMinute) || isNaN(endHour) || isNaN(endMinute)) {
        console.error('Invalid time format');
        return null;
    }
    const startTimeInMinutes = startHour * 60 + startMinute;
    const endTimeInMinutes = endHour * 60 + endMinute;
    const timeDifferenceInMinutes = endTimeInMinutes - startTimeInMinutes;

    return timeDifferenceInMinutes;
}

const availableslots = async (req, res) => {
    const { doctor_id, day, time, department, date } = req.body;
    const slots = (Timedifference(time) / AverageTime[department])
    try {
        const appointments = await Appointment.find({ doctor_id: doctor_id, day: day, time: time, date: date })
        const availableslots = slots - appointments.length + 1;
        if (availableslots > 0) {

        }
        else if (availableslots = 0) {
            res.status(404).json({ availableslots: 0 })
        }
    } catch (error) {
        res.status(400).json(error.message)
    }
}

const patientAppointments = async (req, res) => {
    const { patient_id } = req.body;
    console.log('hit 1')
    if (!mongoose.Types.ObjectId.isValid(patient_id)) {
        return res.status(404).json({ error: "no such patient" });
    }
    const appointments = await Appointment.find({ patient_id: patient_id });

    if (!appointments) {
        return res.status(404).json({ error: "No appointment in directory" });
    }
    res.status(200).json(appointments);
    console.log('hit 2')
};

const createAppointment = async (req, res) => {
    const { patient_id, doctor_id, day, time, date, department } = req.body;
    if (!mongoose.Types.ObjectId.isValid(patient_id)) {
        return res.status(404).json({ error: "no such patient" });
    }
    if (!mongoose.Types.ObjectId.isValid(doctor_id)) {
        return res.status(404).json({ error: "no such doctor" });
    }
    availableslots(req, res);
    try {
        const appointment = await Appointment.create({ patient_id, doctor_id, day, time, date })
        res.status(200).json(appointment);
    } catch (error) {
        res.status(400).json(error.message);
    }
}

const cancelAppointment = async (req, res) => {
    const { _id } = req.body;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).json({ error: "this appointment does not exist !!!" });
    }

    try {
        await Appointment.findByIdAndDelete(_id);
        res.status(200).json("Appointment Cancelled")
    } catch (error) {
        res.status(400).json(error.message);
    }
}

const reschedule = async (req, res) => {
    const { _id, day, time, date } = req.body;
    if (!mongoose.Types.ObjectId.isValid(_id)) {
        return res.status(404).json({ error: "this appointment does not exist !!!" });
    }
    try {
        const reschedule = await Appointment.findByIdAndUpdate({ _id: _id }, { ...req.body }, { new: true })
        const rescheduled = await reschedule.save();
        res.status(200).json(rescheduled)
    } catch (error) {
        res.status(400).json(error.message);
    }
}

router.use(requireAuth)

router.get('/myappointments', patientAppointments)
router.post('/createappointment', createAppointment)
router.delete('/cancelappointment', cancelAppointment)
router.patch('/Patientreschedule', reschedule)

module.exports = router;