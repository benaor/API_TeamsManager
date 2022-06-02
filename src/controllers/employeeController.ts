import { Request, Response } from "express"
import { Controller } from "../decorators/controllers"
import * as sqlite from "sqlite3"
import { get } from "../decorators/route"

@Controller()
class EmployeeController {
  @get()
  getAll(req: Request, res: Response) {
    const dbPath = process.env.DB_PATH || ""
    const db = new sqlite.Database(dbPath)

    db.all("SELECT * FROM Employee", [], (err, rows) => {
      if (err) throw err
      res.json(rows)
    })
  }
}

