import { Request, Response } from "express"
import { Inject } from "../decorators/inject"
import { Keys } from "../keys"
import { Controller } from "../decorators/controllers"
import { Get, Post, Patch } from "../decorators/route"
import { EmployeeRepository } from "../models/repositories/employeeRepository"
import { TeamRepository } from "../models/repositories/teamRepository"
import { Employee } from "../models/types/employee"

@Controller()
class EmployeeController {
  private readonly employeeRepository: EmployeeRepository
  private readonly teamRepository: TeamRepository

  constructor(
    @Inject(Keys.employeeRepository)
    employeeRepository: EmployeeRepository,
    @Inject(Keys.teamRepository)
    teamRepository: TeamRepository
  ) {
    this.employeeRepository = employeeRepository
    this.teamRepository = teamRepository
  }

  @Get()
  async getAll(req: Request, res: Response) {
    const employees = await this.employeeRepository.getAll()
    res.json(employees)
  }

  @Post()
  async post(req: Request, res: Response) {
    const { body } = req
    console.log(body)
    if (this.isEmployee(body)) {
      if (this.isValid(body)) {
        const exist = await this.employeeRepository.exists(body.email)
        if (!exist) {
          await this.employeeRepository.insert(body)
          res.sendStatus(200)
        } else {
          res.status(400).json({
            message: "This email is already used"
          })
        }
      } else {
        res.status(400).json({
          message: "Employee data validation failed"
        })
      }
    } else {
      res.status(400).json({
        message: "Request body is not an Employee"
      })
    }
  }

  @Patch(":employeeId/team/:teamId")
  async changeTeam(req: Request, res: Response) {
    const { employeeId, teamId } = req.params

    if (this.isIdentifier(employeeId) && this.isIdentifier(teamId)) {
      const exist = await this.teamRepository.exists(parseInt(teamId))

      if (exist) {
        await this.employeeRepository.changeTeam(parseInt(employeeId), parseInt(teamId))
        res.sendStatus(200)
      } else res.status(400).json({ message: "Team doesn't exist" })
    } else res.status(400).json({ message: "Invalid Identifier" })
  }

  private isEmployee(value: any): value is Employee {
    return value.firstName && value.lastName && value.email
  }

  private isValid(employee: Employee) {
    return (
      employee.firstName.length &&
      employee.lastName.length &&
      /^[0-9a-z._-]+@{1}[0-9a-z._-]{2,}[.]{1}[a-z]{2,5}$/.test(employee.email)
    )
  }

  private isIdentifier(value: string) {
    return /^\d+$/.test(value)
  }
}

export { EmployeeController }
