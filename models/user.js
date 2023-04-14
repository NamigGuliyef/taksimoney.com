import mongoose, { model, Schema } from "mongoose";
const userSchema = new Schema({

    isActive: { type: Boolean, default: false },
    temp_code: { type: Number },
    referralId: { type: mongoose.Schema.Types.ObjectId, required: true },
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    balance: { type: Number, default: 0 },
    currency: { type: String, default: "USD" },
    referralIds: { type: [mongoose.Schema.Types.ObjectId], required: true },
    my_carIds: { type: [mongoose.Schema.Types.ObjectId], ref: 'car' },
    withdrawIds: { type: [mongoose.Schema.Types.ObjectId], ref: 'withdraw' }

}, { versionKey: false, timestamps: true })

const userModel = model('user', userSchema)
export default userModel
