import { Employee } from "../types/employee"
import { AbstractRepository } from "./abstractRepository"
import { QueryType } from "./queryType"

class EmployeeRepository extends AbstractRepository<Employee> {
  constructor() {
    super()
    this.addQuery(
      QueryType.getAll,
      `SELECT 
    e.Id as id, 
    e.FirstName as firstName,
    e.LastName as lastName,
    e.Email as email, 
    t.Id as teamId
    FROM Employee as e
    LEFT OUTER JOIN Team as t on e.TeamId = t.Id
    `
    )
  }

  getParams(entity: Employee): any[] {
    return [entity.firstName, entity.lastName, entity.email, entity.teamId || undefined]
  }
}

export { EmployeeRepository }
