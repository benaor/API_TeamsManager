import "reflect-metadata" // Always in first positition
import "./models/repositories/teamRepository"
import "./models/repositories/employeeRepository"
import "./controllers/teamController"
import "./controllers/employeeController"
import { routeCollection } from "./infrastructure/routeCollection"
import express from "express"
import { config } from "dotenv"
import bodyParser from "body-parser"
import morgan from "morgan"
import cors from "cors"

config()

const app = express()
const port = process.env.PORT || 3000
const router = express.Router()

app.use(router)
app.use(bodyParser.json())
app.use(morgan("dev"))
app.use(cors())

routeCollection.setupRouter(router)

app.listen(port, () => console.log(`Application running on port ${port}`))
