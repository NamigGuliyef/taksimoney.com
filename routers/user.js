import { Router } from "express";
import joi from "joi";
import userModel from "../models/user.js";
import nodemailer from 'nodemailer'
import { compare, genSalt, hash } from "bcrypt";
import jwt from 'jsonwebtoken'
import { jwt_secret } from "../utils.js";
const r = Router()

//test edilib-> user qeydiyyati

r.post('/sign-up', async (req, res) => {
    const userSchema = joi.object({
        referralId: joi.string(),
        tepm_code: joi.number(),
        username: joi.string().pattern(new RegExp('^[a-zA-Z0-9əöğıüçşƏÖĞIÜÇŞ]{3,30}$')).required(),
        email: joi.string().email({ tlds: { allow: ['com', 'net', 'ru', 'az'] } }).required(),
        password: joi.string().pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*]{3,30}$')).required(),
        referralIds: joi.array(),
        my_carIds: joi.array(),
        withdrawIds: joi.array()
    })
    const { error, value } = userSchema.validate(req.body)
    if (error) {
        return res.status(400).send(error.message)
    }
    const verify_code = Math.floor(Math.random() * 10000)
    const hashPassword = await hash(value.password, await genSalt())
    await userModel.create({ ...value, tepm_code: verify_code, password: hashPassword })
    const mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        auth: {
            user: 'quliyevnamiq8@gmail.com',
            pass: 'wprbqfahngjeiktl',
        }
    });
    let details = {
        from: 'quliyevnamiq8@gmail.com',
        to: `${value.email}`,
        subject: "Verify Code",
        html: `
        <h2>Verify code: ${verify_code} ==> <a href="http://localhost:7000/account/verify">Go to page to enter code</a></h2>`,
    }
    mailTransporter.sendMail(details, (err) => {
        if (err) {
            return res.send(err.message)
        }
    })
    return res.status(200).send('The verification code has been sent to your email address!')
})

//test edilib --> userin tesdiqlenmesi ucun mail adresine kod gondermek

r.post('/verify', async (req, res) => {
    const { verify_code } = req.body
    const check_confirmation = await userModel.findOne({ tepm_code: verify_code })
    if (!check_confirmation) {
        return res.status(401).send('verify the code is wrong')
    } else {
        await userModel.findOneAndUpdate({ tepm_code: verify_code }, { $set: { isActive: true } }, { new: true })
        return res.status(200).send('verification succesful')
    }
})

//test edilib --> userin tesdiqden sonra olan girisi

r.post('/sign-in', async (req, res) => {
    const userSchema = joi.object({
        email: joi.string().email({ tlds: { allow: ['com', 'net', 'ru', 'az'] } }).required(),
        password: joi.string().pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*]{3,30}$')).required(),
    })
    const { error, value: { email, password } } = userSchema.validate(req.body)
    if (error) {
        return res.status(401).send(error.message)
    }
    const user = await userModel.findOne({ email })
    if (user.isActive) {
        if (!user) {
            return res.status(404).send('email not found')
        }
        const passRight = await compare(password, user.password)
        if (!passRight) {
            return res.status(401).send('password is wrong!')
        }
        const token = jwt.sign({ email, _id: user._id }, jwt_secret)
        return res.status(200).send(token)
    } else {
        return res.status(401).send('registration was not confirmed by mail')
    }
})


//test edilib --> unudulan sifrenin berpa edilmesi ucun mail adresine link gondermek

r.post('/forget-password', async (req, res) => {
    const { email } = req.body
    const token = jwt.sign({ email }, jwt_secret)

    const mailTransporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        auth: {
            user: 'quliyevnamiq8@gmail.com',
            pass: 'wprbqfahngjeiktl',
        }
    });
    let details = {
        from: 'quliyevnamiq8@gmail.com',
        to: `${email}`,
        subject: "user password update",
        html: `
        <h2>link to reset your password : <a href="http://localhost:7000/account/recovery/${token}">http://localhost:7000/account/recovery/${token}</a></h2>`,
    }
    mailTransporter.sendMail(details, (err) => {
        if (err) {
            return res.status(401).send(err.message)
        }
        return res.status(200).send('reset your password link has been sent to your email address.')
    })
})

//test edilib --> mail adresinde olan linke daxil olduqdan sonra yonlendirilen sehifede yeni parolu qeyd etmek

r.post('/recovery/:token', (req, res) => {
    const { token } = req.params
    if (!token) {
        return res.status(400).send('token is invalid')
    }
    jwt.verify(token, jwt_secret, async (err, user) => {
        if (err) {
            return res.status(401).send('token is wrong!')
        }
        const userSchema = joi.object({
            new_password: joi.string().pattern(new RegExp('^[a-zA-Z0-9!@#$%^&*]{3,30}$')).required(),
            repeat_password: joi.string().equal(joi.ref("new_password")).required(),
        })
        const { error, value } = userSchema.validate(req.body)
        if (error) {
            return res.status(401).send(error.message)
        }
        const hashPassword = await hash(value.new_password, await genSalt())
        const updateUser = await userModel.findOneAndUpdate({ email: user.email }, { $set: { password: hashPassword } }, { new: true })
        return res.status(200).send(updateUser)
    })
})



export default r
