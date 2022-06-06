import { Request, Response } from "express"
import { Controller } from "../decorators/controllers"
import { get } from "../decorators/route"
import { EmployeeRepository } from "../models/repositories/employeeRepository"
import { Repository } from "../models/repositories/repository"
import { Employee } from "../models/types/employee"

@Controller()
class EmployeeController {
  private readonly employeeRepository: Repository<Employee>

  constructor() {
    this.employeeRepository = new EmployeeRepository()
  }

  @get()
  async getAll(req: Request, res: Response) {
    const employees = await this.employeeRepository.getAll()
    res.json(employees)
  }
}
