import { Dependency } from "../../decorators/dependency"
import { Keys } from "../../keys"
import { Employee } from "../types/employee"
import { AbstractRepository } from "./abstractRepository"
import { QueryType } from "./queryType"
import { Repository } from "./repository"

interface EmployeeRepository extends Repository<Employee> {
  exists(email: string): Promise<boolean>
  changeTeam(employeeId: number, teamId: number): Promise<void>
}
@Dependency(Keys.employeeRepository)
class EmployeeRepositoryImpl extends AbstractRepository<Employee> implements EmployeeRepository {
  constructor() {
    super()

    this.addQuery(
      QueryType.getAll,
      `
      SELECT 
    e.Id as id, 
    e.FirstName as firstName,
    e.LastName as lastName,
    e.Email as email, 
    t.Id as teamId
    FROM Employee as e
    LEFT OUTER JOIN Team as t on e.TeamId = t.Id
    `
    )

    this.addQuery(
      QueryType.Insert,
      `
      INSERT INTO 
      Employee
      (
        FirstName,
        LastName,
        Email,
        TeamId
      )
      VALUE(?, ?, ?, ?)
      `
    )
  }

  getParams(entity: Employee): any[] {
    return [entity.firstName, entity.lastName, entity.email, entity.teamId || undefined]
  }

  async exists(email: string): Promise<boolean> {
    const query = `SELECT COUNT(*) as nb FROM Employee WHERE Email = ?`

    await this.open()
    const row = await this.query(query, [email])
    await this.close()
    return row.nb > 0
  }

  async changeTeam(employeeId: number, teamId: number): Promise<void> {
    const query = `UPDATE Employee SET TeamId = ? WHERE Id = ?`
    await this.open()
    await this.run(query, [teamId, employeeId])
    await this.close()
  }
}

export { EmployeeRepository }
