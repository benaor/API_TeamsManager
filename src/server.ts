import "reflect-metadata" // Always in first positition
import express from "express"
import { config } from "dotenv"
import { routeCollection } from "./infrastructure/routeCollection"
import "./controllers/employeeController"
import bodyParser from "body-parser"
import morgan from "morgan"
import cors from "cors"

config()

const app = express()
const port = process.env.PORT || 3000
const router = express.Router()

routeCollection.setupRouter(router)

app.use(router)
app.use(bodyParser.json())
app.use(morgan("dev"))
app.use(cors())

app.listen(port, () => console.log(`Application running on port ${port}`))
