import jwt from 'jsonwebtoken'
import { jwt_secret } from '../utils.js'

const userAuthMiddleWare = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
        return res.status(400).send('Token is invalid')
    }
    jwt.verify(token, jwt_secret, (err, user) => {
        if (err) {
            return res.status(401).send('Token is wrong!')
        }
        req.user = user
        next()
    })
}

export default userAuthMiddleWare
