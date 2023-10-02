import { Request, Response } from 'express'
import { LoginInfo, User, UserPoint } from '../models/user.model'
import userRepository from '../repositories/user.repository'
import jwtTokenUtil from '../utils/jwt.token.util'
import CommonResult from '../utils/common.result'
export default class UserController {
  /**
   * login
   * @param req
   * @param res
   * @returns
   */
  login = async (req: Request, res: Response) => {
    const result: CommonResult = {
      message: 'success'
    }
    try {
      console.log('Login--Start')
      const loginInfo: LoginInfo = req.body._value
      if (!loginInfo.loginId) {
        result.message = 'password is not correct.'
        console.log('Input error: LoginId empty.')
        res.status(400).send(result)
        return
      }
      if (!loginInfo.password) {
        result.message = 'password is not correct.'
        console.log('Input error: Password empty.')
        res.status(400).send(result)
        return
      }
      const user: User | undefined = await userRepository.retrieveByLoginInfo(loginInfo)
      console.log(user)
      // user exist
      if (user?.id) {
        const token = jwtTokenUtil.generateToken(user)
        console.log(token)
        // update token to DB
        const count = await userRepository.updateLoginToken(user.id, token)
        if (count == 0) {
          result.message = 'Some error occurred.'
          console.log('Failed to update token.')
          res.status(500).send(result)
          return
        }
        result.message = 'Some error occurred.'
        result.data = {
          token: token,
          user: user
        }
        res.status(200).send(result)
      }
      else res.status(400).send({
        message: 'login id or password is not correct.'
      })

    } catch (err) {
      console.log(`Failed to login: ${err}`)
      res.status(500).send({
        message: 'Some error occurred.'
      })
    }
    finally {
      console.log('Login--End')
    }
  }

  /**
   * retrieve employee to recognize
   * @param req
   * @param res
   * @returns
   */
  getUsers = async (req: Request, res: Response) => {
    const result: CommonResult = {
      message: 'success',
      data: []
    }
    try {
      const query = req.query
      const userId = Number(query.userId)
      const offset = Number(query.offset)
      const limit = Number(query.limit)
      const userName = String(query.userName)
      const employeeList: User[] = await userRepository.retrieveRecognitionUsers(userId, offset, limit, userName)
      console.log(`employee list size: ${employeeList.length}`)
      result.data = employeeList
      res.status(200).send(result)
    } catch (err) {
      console.log(`Failed to retrieve employee: ${err}`)
      result.message = 'Some error occurred.'
      res.status(500).send(result)
    }
  }

  /**
   * retrieve recognized points for login user
   * @param req
   * @param res
   */
  getUserPoint = async (req: Request, res: Response) => {
    const result: CommonResult = {
      message: 'success'
    }
    try {
      const userId = Number(req.params.id)
      const userPoint: UserPoint = await userRepository.retrieveUserPoint(userId)
      result.data = userPoint
      res.status(200).send(result)
    } catch (err) {
      console.log(`Failed to retrieve recognized point: ${err}`)
      result.message = 'Some error occurred.'
      res.status(500).send(result)
    }
  }

  /*
  async getUserProfile(req: Request, res: Response) {
    try {

      const userId = Number(req.params.id)
      const query = req.query
      const offset = Number(query.offset)
      const limit = Number(query.limit)
      const staffList: Staff[] = await userRepository.getUsersByManagerId(userId, offset, limit, userName)
      // user exist
      // console.log(staffList)
      res.status(200).send({
        message: 'success',
        data: staffList
      })
    } catch (err) {
      res.status(500).send({
        message: 'Some error occurred.'
      })
    }
  }
*/
}
