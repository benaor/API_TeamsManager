import { Entity } from "../types/entity"

interface Repository<T extends Entity> {
  getAll(): Promise<T[]>
  insert(entity: T): Promise<void>
}

export { Repository }
