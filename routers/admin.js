import { Router } from "express";
import joi from 'joi'
import adminModel from "../models/admin.js";
import { compare } from "bcrypt";
import jwt from 'jsonwebtoken'
import { jwt_secret_admin } from '../utils.js'
const r = Router()

//test edilib - admin girisi token almaq

r.post('/sign-in', async (req, res) => {
    const adminSchema = joi.object({
        email: joi.string().email({ tlds: { allow: ['com', 'net', 'ru', 'az'] } }).required(),
        password: joi.string().pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*]{3,30}$')).required(),
    })
    const { error, value: { email, password } } = adminSchema.validate(req.body)
    if (error) {
        return res.status(400).send(error.message)
    }
    const admin = await adminModel.findOne({ email })
    if (!admin) {
        return res.status(404).send('Email not found')
    }
    const passRight = compare(password, admin.password)
    if (!passRight) {
        return res.status(401).send('Password is wrong!')
    }
    const token = jwt.sign({ email, _id: admin._id }, jwt_secret_admin)
    return res.status(200).send(token)
})

export default r
