import mongoose, { model, Schema } from "mongoose";
const withdrawSchema = new Schema({

    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "user" },
    totalAmount: { type: Number, required: true },
    currencyId: { type: String, default: 'USD' }

}, { versionKey: false, timestamps: true })

const withdrawModel = model('withdraw', withdrawSchema)
export default withdrawModel
