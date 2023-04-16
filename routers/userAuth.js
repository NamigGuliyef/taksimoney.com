import { Router } from "express";
import carModel from "../models/car.js";
import carLevelModel from "../models/car_level.js";
import userModel from "../models/user.js";
const r = Router()

//test edilib --> butun levelleri bize gosterecek

r.get('/car-levels', async (req, res) => {
    const allLevels = await carLevelModel.find()
    return res.status(200).send(allLevels)
})


r.get('/car-levels/lvl1_shop', async (req, res) => {
    const allLvl1Car = await carModel.find().
        populate({
            path: 'level_Id', match: { title: { $eq: 'Level 2' } }, select: 'title'
        }).exec();
    console.log(allLvl1Car)
})


export default r
