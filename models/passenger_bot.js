import mongoose, { model, Schema } from "mongoose";

const passengerBotSchema = new Schema({

    level_id: { type: mongoose.Schema.Types.ObjectId, required: true },
    carsId: { type: mongoose.Schema.Types.ObjectId, required: true },
    bot_photo: { type: String, required: true },

}, { versionKey: false, timestamps: true })

const passengerBotModel = model('passengerBot', passengerBotSchema)
export default passengerBotModel;
