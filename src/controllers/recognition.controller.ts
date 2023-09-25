import { Request, Response } from 'express'
import recognitionRepository from '../repositories/recognition.repository'
import CommonResult from '../utils/common.result'
import { Activity, Recognition } from '../models/recognition.model'

/**
 * controller for recognition
 */
export default class RecognitionController {
  /**
   * create a recogition
   * @param req
   * @param res
   * @returns
   */
  createRecognition = async (req: Request, res: Response) => {
    const result: CommonResult = {
      message: 'success'
    }
    try {
      console.log('Create recognition--Start')
      const recognition: Recognition = req.body._value
      console.log(`request body: `)
      console.log(req.body)
      // input validation
      if (!this.validateRecognition(result, res, recognition)) return

      const insertId = await recognitionRepository.createRecognition(recognition)
      if (insertId) res.status(200).send(result)
      else {
        result.message = 'Some error occurred while creating recognition.'
        res.status(501).send(result)
      }

    } catch (err) {
      console.log(`error occurred while creating recognition: ${err}`)
      result.message = 'Some error occurred while creating recognition.'
      res.status(501).send(result)
    } finally {
      console.log('Create recognition--End')
    }
  }

  /**
   * Retrieve user's recognition activities
   * @param req
   * @param res
   */
  getRecognitionActiviy = async (req: Request, res: Response) => {
    const result: CommonResult = {
      message: 'success',
      data: []
    }
    try {
      console.log('Get recognition activity timeline--Start')
      const query = req.query
      const offset = Number(query.offset)
      const limit = Number(query.limit)
      const userId = Number(query.userId)
      const recognitionList: Activity[] = await recognitionRepository.getRecognitionsByCreateUserId(userId, offset, limit)
      console.log(recognitionList)
      result.data = recognitionList
      res.status(200).send(result)
    } catch (err) {
      console.log(`error occurred while creating recognition: ${err}`)
      result.message = 'Some error occurred while creating recognition.'
      res.status(501).send(result)
    } finally {
      console.log('Get recognition activity timeline--End')
    }
  }

  /**
   *
   * @param recognition
   * @param result
   * @param res
   * @returns
   */
  private validateRecognition(result: CommonResult, res: Response, recognition?: Recognition): boolean {
    if (!recognition?.recognitionUserId) {
      console.log('Input error: recognitionUserId')
      result.message = 'Content can not be empty.'
      res.status(400).send(result)
      return false
    }
    if (!recognition?.createUserId) {
      console.log('Input error: createUserId')
      result.message = 'Content can not be empty.'
      res.status(400).send(result)
      return false
    }
    if (!recognition?.point) {
      console.log('Input error: point')
      result.message = 'Content can not be empty.'
      res.status(400).send(result)
      return false
    }
    if (!recognition?.detail) {
      console.log('Input error: detail')
      result.message = 'Content can not be empty.'
      res.status(400).send(result)
      return false
    }
    return true
  }
}