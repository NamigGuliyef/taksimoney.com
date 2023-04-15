import mongoose, { model, Schema } from "mongoose";
const adminSchema = new Schema({
    
    username: { type: String, unique: true, required: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, unique: true, required: true, },
    password: { type: String, required: true }

}, { versionKey: false, timestamps: true })

const adminModel = model('admin', adminSchema)
export default adminModel