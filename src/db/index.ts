import mysql from 'mysql2'
import dbConfig from './db.config'

// export default mysql.createConnection({
//   host: dbConfig.HOST,
//   user: dbConfig.USER,
//   password: dbConfig.PASSWORD,
//   database: dbConfig.DB
// })

// mongodb

// redis

// casandra
export default mysql.createPool({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
  connectionLimit: 10,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
})

