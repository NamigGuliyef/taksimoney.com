import mongoose, { connect } from "mongoose";
import express from 'express'
import { port, uri } from "./utils.js";
import userRouter from "./routers/user.js";
import userAuthRouter from "./routers/userAuth.js";
import userAuthMiddleWare from "./auth/user.js";
import withdrawModel from "./models/withdraw.js";


connect(uri)
const app = express()
app.use(express.json())


app.use('/account', userRouter)
app.use('/user/dashboard', userAuthMiddleWare, userAuthRouter)


app.listen(port, () => console.log(`port ${port} server is up...`))
