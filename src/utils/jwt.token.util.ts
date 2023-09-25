import jwt, { JwtPayload, Secret } from 'jsonwebtoken'
import { Request, Response, NextFunction } from 'express'
import { User } from '../models/user.model'

const secretKey: Secret = 'mysecretkey'

class JwtTokenUtil {
  generateToken(userDetail: User): string {
    console.log(userDetail)
    return jwt.sign({ userDetail }, secretKey, { expiresIn: '1h' })
  }

  auth(req: Request, res: Response, next: NextFunction) {
    // console.log(req.header('Authorization'))
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '')
      if (!token) {
        res.status(401).send('Please authenticate.')
        return
      }
      const decoded = jwt.verify(token, secretKey)
      // TODO: validate user id and token from db
      // (req as CustomRequest).token = decoded
      next()
    } catch (err) {
      res.status(401).send('Please authenticate')
    }
  }
}
export default new JwtTokenUtil()