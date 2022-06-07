import { Request, response, Response } from "express"
import { Controller } from "../decorators/controllers"
import { Inject } from "../decorators/inject"
import { Get } from "../decorators/route"
import { Keys } from "../keys"
import { TeamRepository } from "../models/repositories/teamRepository"

@Controller()
class TeamController {
  private readonly teamRepository: TeamRepository

  constructor(
    @Inject(Keys.teamRepository)
    teamRepository: TeamRepository
  ) {
    this.teamRepository = teamRepository
  }

  @Get()
  async getAll(req: Request, res: Response) {
    const teams = await this.teamRepository.getAll()
    res.json(teams)
  }
}
