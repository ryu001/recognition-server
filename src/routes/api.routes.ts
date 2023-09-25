import { Router } from 'express'
import UserController from '../controllers/user.controller'
import RecognitionController from '../controllers/recognition.controller'
import jwtTokenUtil from '../utils/jwt.token.util'

class APIRoutes {
  router = Router()
  userController = new UserController()
  recognitionController = new RecognitionController()

  constructor() {
    this.intializeRoutes()
  }

  intializeRoutes() {
    // login
    this.router.post('/login', this.userController.login)

    // retrieve employee list to recognize
    this.router.get('/users', jwtTokenUtil.auth, this.userController.getUsers)

    //retrieve recognized points for user
    this.router.get('/users/:id/point', jwtTokenUtil.auth, this.userController.getUserPoint)

    // Create a new Recognition
    this.router.post('/recognitions', jwtTokenUtil.auth, this.recognitionController.createRecognition)

    // Retrieve last 100 recognition activities
    this.router.get('/activities', jwtTokenUtil.auth, this.recognitionController.getRecognitionActiviy)
  }
}

export default new APIRoutes().router
