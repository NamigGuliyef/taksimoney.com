import { Router } from 'express'
import joi from 'joi'
import { hash, genSalt } from 'bcrypt'
import adminModel from '../models/admin.js'
import cloudinary from '../config_upload/cloudinary.js'
import upload from '../config_upload/multer.js'
import carLevelModel from '../models/car_level.js'
import passengerBotModel from '../models/passenger_bot.js'
import carModel from '../models/car.js'


const r = Router()

//test edilib --> yeni admin elave edilmesi

r.post('/add-admin', async (req, res) => {
    const adminSchema = joi.object({
        username: joi.string().pattern(new RegExp('^[a-zA-Z0-9 əöğıüçşƏÖĞIÜÇŞ]{3,30}$')).required(),
        name: joi.string().pattern(new RegExp('^[a-zA-ZəöğıüçşƏÖĞIÜÇŞ]{3,30}$')).required(),
        surname: joi.string().pattern(new RegExp('^[a-zA-ZəöğıüçşƏÖĞIÜÇŞ]{3,30}$')).required(),
        email: joi.string().email({ tlds: { allow: ['com', 'net', 'ru', 'az'] } }).required(),
        password: joi.string().pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*]{3,30}$')).required(),
    })
    const { error, value } = adminSchema.validate(req.body)
    if (error) {
        return res.status(400).send(error.message)
    }
    const hashPassword = await hash(value.password, await genSalt())
    const addAdmin = await adminModel.create({ ...value, password: hashPassword })
    return res.status(200).send(addAdmin)
})

//test edilib --> adminin yaratdigi yeni masin leveli yaradir

r.post('/car-level', upload.single('photo'), async (req, res) => {
    const carLevelSchema = joi.object({
        photo: joi.string(),
        title: joi.string().pattern(new RegExp('^[a-zA-Z0-9 ,.əöğıüçşƏÖĞIÜÇŞ]{3,100}$')).required(),
        description: joi.string().pattern(new RegExp('^[a-zA-Z0-9 ,.()əöğıüçşƏÖĞIÜÇŞ]{3,100}$')).required()
    })
    const { error, value } = carLevelSchema.validate(req.body)
    if (error) {
        return res.status(401).send(error.message)
    }
    const data = await cloudinary.uploader.upload(req.file.path, { public_id: req.file.originalname })
    const newCarLevel = await carLevelModel.create({ ...value, photo: data.url })
    return res.status(200).send(newCarLevel)
})

//test edilib --> adminin yaratdigi masin levellerin getirir

r.get('/car-level', async (req, res) => {
    const allCarLevel = await carLevelModel.find()
    return res.status(200).send(allCarLevel)
})

//test edilib --> id-ye gore car-level de deyisiklik etmek

r.put('/car-level/:id', upload.single('photo'), async (req, res) => {
    const carLevelSchema = joi.object({
        photo: joi.string(),
        title: joi.string().pattern(new RegExp('^[a-zA-Z0-9 ,.əöğıüçşƏÖĞIÜÇŞ]{3,100}$')).required(),
        description: joi.string().pattern(new RegExp('^[a-zA-Z0-9 ,.()əöğıüçşƏÖĞIÜÇŞ]{3,100}$')).required()
    })
    const { error, value } = carLevelSchema.validate(req.body)
    if (error) {
        return res.status(401).send(error.message)
    }
    const data = await cloudinary.uploader.upload(req.file.path, { public_id: req.file.originalname })
    const updateCarLevel = await carLevelModel.findOneAndUpdate({ _id: req.params.id }, { $set: { ...value, photo: data.url } }, { new: true })
    return res.status(200).send(updateCarLevel)
})

//test edilib --> sernisin botu elave etmek

r.post('/passenger-bot', upload.single('photo'), async (req, res) => {
    const passengerBotSchema = joi.object({
        level_Id: joi.string(),
        carsId: joi.string(),
        photo: joi.string()
    })
    const { error, value } = passengerBotSchema.validate(req.body)
    if (error) {
        return res.status(401).send(error.message)
    }
    const data = await cloudinary.uploader.upload(req.file.path, { public_id: req.file.originalname })
    const newPassengerBot = await passengerBotModel.create({ ...value, photo: data.url })
    return res.status(200).send(newPassengerBot)
})

//test edilib --> umumi botlari getirir 

r.get('/passenger-bot', async (req, res) => {
    const allPassengerBot = await passengerBotModel.find().populate([
        { path: 'level_Id', select: 'title' },
        { path: 'carsId', select: ['car_name', 'passenger_transport_price'] }
    ])
    return res.status(200).send(allPassengerBot)
})

//test edilib --> botu id-ye gore deyisir

r.put('/passenger-bot/:id', upload.single('photo'), async (req, res) => {
    const passengerBotSchema = joi.object({
        level_Id: joi.string(),
        carsId: joi.string(),
        photo: joi.string()
    })
    const { error, value } = passengerBotSchema.validate(req.body)
    if (error) {
        return res.status(401).send(error.message)
    }
    const data = await cloudinary.uploader.upload(req.file.path, { public_id: req.file.originalname })
    const updatePassengerBot = await passengerBotModel.findOneAndUpdate({ _id: req.params.id }, { $set: { ...value, photo: data.url } }, { new: true })
    return res.status(200).send(updatePassengerBot)
})

//test edilib --> sernisin botu silmek

r.delete('/passenger-bot/:id', async (req, res) => {
    const deletedPassengerBot = await passengerBotModel.findOneAndDelete({ _id: req.params.id })
    return res.status(200).send(deletedPassengerBot)
})

//test edilib --> masin elave etmek

r.post('/car', upload.single('photo'), async (req, res) => {
    const createCarSchema = joi.object({
        level_Id: joi.string().required(),
        photo: joi.string(),
        car_name: joi.string().pattern(new RegExp('^[a-zA-Z0-9 ]{3,100}$')).required(),
        car_price: joi.number().required(),
        currency: joi.string(),
        car_fuel: joi.number().required(),
        car_fuel_price: joi.number().required(),
        fuel_used_for_passenger: joi.number().required(),
        earnings_percent: joi.number().required(),
        daily_earnings: joi.number().required(),
        total_earnings: joi.number().required(),
        total_earnings_day: joi.number().required(),
        passenger_pickup_time: joi.string().required(),
        passenger_transport_price: joi.number().required(),
        passenger_count_day: joi.number().required(),
        user_Ids: joi.array()
    })
    const { error, value } = createCarSchema.validate(req.body)
    if (error) {
        return res.status(401).send(error.message)
    }
    const data = await cloudinary.uploader.upload(req.file.path, { public_id: req.file.originalname })
    const createdData = await carModel.create({ ...value, photo: data.url })
    return res.status(200).send(createdData)
})

//test edilib --> butun masinlari bize verir.

r.get('/car', async (req, res) => {
    const data = await carModel.find().populate({
        path: 'level_Id',
        select: 'title',
    })
    return res.status(200).send(data)
})

//test edilib --> masinlarda deyisiklik etmek

r.put('/car/:id', upload.single('photo'), async (req, res) => {
    const updateCarSchema = joi.object({
        level_Id: joi.string().required(),
        photo: joi.string(),
        car_name: joi.string().pattern(new RegExp('^[a-zA-Z0-9 ]{3,100}$')).required(),
        car_price: joi.number().required(),
        currency: joi.string(),
        car_fuel: joi.number().required(),
        car_fuel_price: joi.number().required(),
        fuel_used_for_passenger: joi.number().required(),
        earnings_percent: joi.number().required(),
        daily_earnings: joi.number().required(),
        total_earnings: joi.number().required(),
        total_earnings_day: joi.number().required(),
        passenger_pickup_time: joi.string().required(),
        passenger_transport_price: joi.number().required(),
        passenger_count_day: joi.number().required(),
        user_Ids: joi.array()
    })
    const { error, value } = updateCarSchema.validate(req.body)
    if (error) {
        return res.status(401).send(error.message)
    }
    const data = await cloudinary.uploader.upload(req.file.path, { public_id: req.file.originalname })
    const updateCar = await carModel.findOneAndUpdate({ _id: req.params.id }, { $set: { ...value, photo: data.url } }, { new: true })
    return res.status(200).send(updateCar)
})

export default r
