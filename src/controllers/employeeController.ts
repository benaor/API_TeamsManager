import { Keys } from "../keys"
import { Inject } from "../decorators/inject"
import { Request, Response } from "express"
import { Controller } from "../decorators/controllers"
import { Get } from "../decorators/route"
import { Repository } from "../models/repositories/repository"
import { Employee } from "../models/types/employee"

@Controller()
class EmployeeController {
  private readonly employeeRepository: Repository<Employee>

  constructor(
    @Inject(Keys.employeeRepository)
    employeeRepository: Repository<Employee>
  ) {
    this.employeeRepository = employeeRepository
  }

  @Get()
  async getAll(req: Request, res: Response) {
    const employees = await this.employeeRepository.getAll()
    res.json(employees)
  }
}

export { EmployeeController }
