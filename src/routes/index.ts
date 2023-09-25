import { Application } from 'express'
import apiRoutes from './api.routes'

export default class Routes {
  constructor(app: Application) {
    app.use('/api', apiRoutes)
  }
}
