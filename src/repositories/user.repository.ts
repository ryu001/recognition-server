import { ResultSetHeader } from 'mysql2'
import connection from '../db'
import { LoginInfo, User, UserPoint } from '../models/user.model'

/**
 * interface of user repository
 */
interface IUserRepository {
  // login
  retrieveByLoginInfo(loginInfo: LoginInfo): Promise<User | undefined>
  // retrieve employee to recognize
  retrieveRecognitionUsers(id: number, offset: number, limit: number, userName?: string): Promise<User[]>
  // retrieve recognized point from user
  retrieveUserPoint(id: number): Promise<UserPoint>
  // update token after user login
  updateLoginToken(id: number, token: string): Promise<number>
}

/**
 * user repository
 */
class UserRepository implements IUserRepository {
  /**
   * login
   * @param loginInfo
   * @returns
   */
  retrieveByLoginInfo(loginInfo: LoginInfo): Promise<User | undefined> {
    return new Promise((resolve, reject) => {
      connection.query<User[]>(
        'SELECT id, loginId, userName, userMail, userRole, avatarUrl FROM user WHERE loginId = ? and password = ?',
        [loginInfo.loginId, loginInfo.password],
        (err, res) => {
          if (err) {
            console.log(`retrieveByLoginInfo error info: ${err}`)
            reject(err)
          }
          else resolve(res?.[0])
        }
      )
    })
  }

  /**
   * retrieve employee to recognize
   * @param id
   * @param offset
   * @param limit
   * @param userName
   * @returns
   */
  retrieveRecognitionUsers(id: number, offset: number, limit: number, userName?: string): Promise<User[]> {
    return new Promise((resolve, reject) => {
      const query = `SELECT id, userMail, userName, userRole, avatarUrl FROM user WHERE id <> ? `+ (userName ? ` and userName like ?` : ``) + ` limit ? offset ?`
      const parameter = userName ? [id, `%${userName}%`, limit, offset] : [id, limit, offset]
      connection.query<User[]>(
        query,
        parameter,
        (err, res) => {
          if (err) {
            console.log(`retrieveRecognitionUsers error info: ${err}`)
            reject(err)
          }
          else resolve(res)
        }
      )
    })
  }

  /**
   * retrieve recognized point from user
   * @param id
   * @returns
   */
  retrieveUserPoint(id: number): Promise<UserPoint> {
    return new Promise((resolve, reject) => {
      connection.query<[UserPoint]>(
        `SELECT recognitionUserId, sum(point) as point
        FROM recognition
        WHERE recognitionUserId = ?`,
        [id],
        (err, res) => {
          if (err) {
            console.log(`retrieveUserPoint error info: ${err}`)
            reject(err)
          }
          else resolve(res[0])
        }
      )
    })
  }

  /**
   * update token after user login
   * @param id
   * @param token
   * @returns
   */
  updateLoginToken(id: number, token: string): Promise<number> {
    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>(
        'UPDATE user SET token = ? where id = ?',
        [token, id],
        (err, res) => {
          if (err) {
            console.log(`updateLoginToken error info: ${err}`)
            reject(err)
          }
          else
            resolve(res.affectedRows)
        }
      )
    })
  }
}

export default new UserRepository()
