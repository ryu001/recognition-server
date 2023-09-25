import express, { Application } from "express"
import cors from "cors"
import Server from "./src/index"

const app: Application = express()
const server: Server = new Server(app)
const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 8081
app.use(
  cors({
    origin: "*",
    credentials: true
  })
)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE")
  res.header("Access-Control-Allow-Headers", "Content-Type")
  next()
})

app
  .listen(PORT, "localhost", function () {
    console.log(`Server is running on port ${PORT}.`)
  })
  .on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
      console.log("Error: address already in use")
    } else {
      console.log(err)
    }
  })
