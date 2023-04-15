import mongoose, { model, Schema } from "mongoose";

const passengerBotSchema = new Schema({

    level_Id: { type: mongoose.Schema.Types.ObjectId, ref: 'carLevel', required: true },
    carsId: { type: mongoose.Schema.Types.ObjectId, ref: 'car', required: true },
    photo: { type: String, required: true },

}, { versionKey: false, timestamps: true })

const passengerBotModel = model('passengerBot', passengerBotSchema)
export default passengerBotModel;
