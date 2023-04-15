import jwt from 'jsonwebtoken'
import { jwt_secret_admin } from '../utils.js'

const adminAuthMiddleWare = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
        return res.status(400).send('Token is invalid')
    }
    jwt.verify(token, jwt_secret_admin, (err, admin) => {
        if (err) {
            return res.status(401).send('Token is wrong!')
        }
        req.admin = admin
        next()
    })
}

export default adminAuthMiddleWare
