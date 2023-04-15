import mongoose, { connect } from "mongoose";
import express from 'express'
import { port, uri } from "./utils.js";
import userRouter from "./routers/user.js";
import adminRouter from './routers/admin.js'
import userAuthRouter from "./routers/userAuth.js";
import adminAuthRouter from "./routers/adminAuth.js";
import userAuthMiddleWare from "./auth/user.js";
import adminAuthMiddleWare from './auth/admin.js'

connect(uri)
const app = express()
app.use(express.json())

app.use('/account', userRouter)
app.use('/admin', adminRouter)
app.use('/user/dashboard', userAuthMiddleWare, userAuthRouter)
app.use('/admin/dashboard', adminAuthMiddleWare, adminAuthRouter)


app.listen(port, () => console.log(`port ${port} server is up...`))
