import { ResultSetHeader } from 'mysql2'
import connection from '../db'

import { Recognition, Activity } from '../models/recognition.model'

/**
 * interface of recognition repository
 */
interface IRecognitionRepository {
  createRecognition(recognition: Recognition): Promise<number | undefined>
  getRecognitionsByCreateUserId(id: number, offset: number, limit: number): Promise<Activity[]>
}

/**
 * recognition repository
 */
class RecognitionRepository implements IRecognitionRepository {
  /**
   * create a recogition
   * @param recognition
   * @returns
   */
  createRecognition(recognition: Recognition): Promise<number> {
    return new Promise((resolve, reject) => {
      connection.query<ResultSetHeader>(
        'INSERT INTO recognition (recognitionUserId, createUserId, point, detail) VALUES(?,?,?,?)',
        [recognition.recognitionUserId,
          recognition.createUserId,
          recognition.point,
          recognition.detail
        ],
        (err, res) => {
          if (err) reject(err)
          else resolve(res.insertId)
        }
      )
    })
  }

  /**
   * Retrieve user's recognition activities
   * @param id
   * @param offset
   * @param limit
   * @returns
   */
  getRecognitionsByCreateUserId(id: number, offset: number, limit: number): Promise<Activity[]> {
    return new Promise((resolve, reject) => {
      connection.query<Activity[]>(
        `SELECT r.id as recognitionId,
        u.userName as recognitionUserName,
        DATE_FORMAT(r.createdTime,'%Y-%m-%d') as recognitionCreatedTime,
        r.detail as recognitionDetail
        FROM recognition r left join user u on r.recognitionUserId = u.id
        WHERE createUserId = ?
        ORDER BY r.createdTime desc
        limit ? offset ?`,
        [id, limit, offset],
        (err, res) => {
          if (err) {
            console.log(`error info: ${err}`)
            reject(err)
          }
          else resolve(res)
        }
      )
    })
  }
}

export default new RecognitionRepository()
