import { Inject } from "../decorators/inject"
import { Keys } from "../keys"
import { Controller } from "../decorators/controllers"
import { Get, Post } from "../decorators/route"
import { EmployeeRepository } from "../models/repositories/employeeRepository"
import { Employee } from "../models/types/employee"
import { Request, Response } from "express"

@Controller()
class EmployeeController {
  private readonly employeeRepository: EmployeeRepository

  constructor(
    @Inject(Keys.employeeRepository)
    employeeRepository: EmployeeRepository
  ) {
    this.employeeRepository = employeeRepository
  }

  @Get()
  async getAll(req: Request, res: Response) {
    const employees = await this.employeeRepository.getAll()
    res.json(employees)
  }

  @Post()
  async post(req: Request, res: Response) {
    if (this.isEmployee(req.body)) {
      if (this.isValid(req.body)) {
        const exist = await this.employeeRepository.exists(req.body.email)
        if (!exist) {
          await this.employeeRepository.insert(req.body)
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
}

export { EmployeeController }
