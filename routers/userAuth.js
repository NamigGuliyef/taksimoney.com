import { Router } from "express";
import userModel from "../models/user.js";
const r = Router()

r.get('/profile', async (req, res) => {
    const { email } = req.user;
    const { password, temp_code, isActive, ...data } = (await userModel.findOne({ email }).populate({
        path: "withdrawIds", select: "totalAmount",
        // populate: { path: "currencyId", select: "name" }
    }))._doc
    res.send({ data })
})


export default r
