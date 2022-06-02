import express from "express"
import { config } from "dotenv"
import { routeCollection } from "./infrastructure/routeCollection"
import "./controllers/employeeController"

config()

const app = express()
const port = process.env.PORT || 3000

const router = express.Router()
routeCollection.setupRouter(router)
app.use(router)

app.listen(port, () => console.log(`Application running on port ${port}`))
