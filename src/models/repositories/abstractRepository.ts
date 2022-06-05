import { Database } from "sqlite3"
import { Entity } from "../types/entity"
import { QueryType } from "./queryType"
import { Repository } from "./repository"

abstract class AbstractRepository<T extends Entity> implements Repository<T> {
  private database!: Database

  private queries: Array<[QueryType, string]>

  constructor() {
    this.queries = []
  }

  protected addQuery(type: QueryType, sql: string) {
    const hasQuery = this.queries.some((value) => value[0] === type)

    if (hasQuery) throw new Error(`${QueryType[type]} already registered!`)

    this.queries.push([type, sql])
  }

  protected getQuery(type: QueryType) {
    const query = this.queries.find((value) => value[0] === type)

    if (!query) throw new Error(`${QueryType[type]} isn't supported by this repository!`)

    return query[1]
  }

  abstract getParams(entity: T): any[]

  protected open(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const dbPath = process.env.DB_PATH || ""
      this.database = new Database(dbPath, (err) => {
        if (err) reject(err)
        else resolve()
      })
    })
  }

  protected close(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!this.database) reject(new Error("Connection is not opened"))
      else
        this.database.close((err) => {
          if (err) reject(err)
          else resolve()
        })
    })
  }

  protected all(sql: string): Promise<T[]> {
    return new Promise<T[]>((resolve, reject) => {
      this.database.all(sql, (err, rows) => {
        if (err) reject(err)
        else resolve(rows)
      })
    })
  }

  async getAll(): Promise<T[]> {
    const query = this.getQuery(QueryType.getAll)
    await this.open()
    const entities = await this.all(query)
    await this.close()

    return entities
  }
}

export { AbstractRepository }
