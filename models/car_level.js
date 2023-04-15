import mongoose, { model, Schema } from "mongoose";
const carLevelSchema = new Schema({

    photo: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true }

}, { versionKey: false, timestamps: true })

const carLevelModel = model('carLevel', carLevelSchema)
export default carLevelModel
