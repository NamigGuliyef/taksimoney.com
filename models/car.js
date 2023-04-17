import mongoose, { model, Schema } from "mongoose";
const carSchema = new Schema({

    level_Id: { type: mongoose.Schema.Types.ObjectId, ref: 'carLevel', required: true },
    photo: { type: String, required: true },
    car_name: { type: String, required: true },
    car_price: { type: Number, required: true },
    currency: { type: String, default: 'USD' },
    car_fuel: { type: Number, required: true },
    car_fuel_price: { type: Number, required: true },
    fuel_used_for_passenger: { type: Number, required: true },
    earnings_percent: { type: Number, required: true },
    daily_earnings: { type: Number, required: true },
    total_earnings: { type: Number, required: true },
    total_earnings_day: { type: Number, required: true },
    passenger_pickup_time: { type: String, required: true },
    passenger_transport_price: { type: Number, required: true },
    passenger_count_day: { type: Number, required: true },
    user_Ids: { type: [mongoose.Schema.Types.ObjectId], ref: 'buyCars', required: true }

}, { versionKey: false, timestamps: true })

const carModel = model('car', carSchema)
export default carModel
