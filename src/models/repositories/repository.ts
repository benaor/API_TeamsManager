import { Entity } from "../types/entity"

interface Repository<T extends Entity> {
  getAll(): Promise<T[]>
}

export { Repository }
