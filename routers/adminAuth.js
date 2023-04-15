import { Router } from 'express'
import joi from 'joi'
import { hash, genSalt } from 'bcrypt'
import adminModel from '../models/admin.js'
import cloudinary from '../config_upload/cloudinary.js'
import upload from '../config_upload/multer.js'
import carLevelModel from '../models/car_level.js'


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

r.post('/car-level', upload.single('img'), async (req, res) => {
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
    value.adminId = req.admin._id
    const newCarLevel = await carLevelModel.create({ ...value, photo: data.url })
    return res.status(200).send(newCarLevel)
})

//test edilib --> adminin yaratdigi masin levellerin getirir

r.get('/car-level', async (req, res) => {
    const allCarLevel = await carLevelModel.find({ adminId: req.admin._id })
    return res.status(200).send(allCarLevel)
})

//test edilib --> id-ye gore car-level de deyisiklik etmek

r.put('/car-level/:id', upload.single('img'), async (req, res) => {
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


r.post('/car', async (req, res) => {



})

export default r
