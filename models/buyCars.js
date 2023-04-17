import mongoose, { model, Schema } from "mongoose";
const buyCarSchema = new Schema({
    carId: { type: mongoose.Schema.Types.ObjectId, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId },
    buy_car_count: { type: Number, default: 1 }
}, { versionKey: false, timestamps: true })


buyCarSchema.post('save', async function () {
    await mongoose.model('car').findOneAndUpdate({ _id: this.carId }, { $push: { user_Ids: this.userId } })
})


const buyCarModel = model('buyCars', buyCarSchema)
export default buyCarModel