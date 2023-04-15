import { Router } from "express";
import carLevelModel from "../models/car_level.js";
import userModel from "../models/user.js";
const r = Router()


r.get('/texi-levels', async (req, res) => { 
    const {adminId, ...value} = await carLevelModel.find() 
    return res.status(200).send(value) 
})

export default r
