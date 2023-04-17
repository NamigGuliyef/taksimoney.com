import { Router } from "express";
import buyCarModel from "../models/buyCars.js";
import carModel from "../models/car.js";
import carLevelModel from "../models/car_level.js";
import userModel from "../models/user.js";
const r = Router()

//test edilib --> butun levelleri bize gosterecek

r.get('/car-levels', async (req, res) => {
    const allLevels = await carLevelModel.find()
    return res.status(200).send(allLevels)
})

//test edilib --> levellerine gore masinlari istifadeci gore bilsin

r.get('/car-levels/lvl1_shop', async (req, res) => {
    const allLvl1Car = await carModel.find().
        populate({
            path: 'level_Id', match: { title: { $eq: 'Level 1' } }, select: 'title'
        }).then((cars) => cars.filter(({ level_Id }) => level_Id != null))
    return res.status(200).send(allLvl1Car)
})


r.post('/car-levels/lvl1_shop', async (req, res) => {
    const { _id, car_price } = await carModel.findOne({ _id: req.body.carId })
    const { balance } = await userModel.findOne({ _id: req.user._id })
    const resultBalance = balance - car_price
    if (resultBalance < 0) {
        return res.status(401).send('There is insufficient amount in the balance')
    }
    await userModel.findOneAndUpdate({ _id: req.user._id }, { $set: { balance: resultBalance } }, { new: true })
    const carIdExist = await buyCarModel.findOne({ _id: req.user._id, carId: req.body.carId })
    if (carIdExist) {
        const update_buy_car_count = carIdExist.buy_car_count + 1
        await buyCarModel.findOneAndUpdate({ _id: req.user._id, carId: req.body.carId }, { $set: { buy_car_count: update_buy_car_count } }, { new: true })
    } else {
        await buyCarModel.create({ userId: req.user._id, carId: _id })
    }
    return res.status(200).send("Bought Car")
})

export default r
