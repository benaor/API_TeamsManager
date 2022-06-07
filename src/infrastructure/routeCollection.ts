import { INJECTIONS_METADATA_KEY } from "../decorators/inject"
import { dependencyService } from "./dependencyService"
import { Router } from "express"
import { asyncMiddleware } from "./async-middleware"

type HttpVerb = "get" | "post" | "patch"

interface ControllerInformations {
  controllerName: string
  ctor: new (...args: any[]) => any
  prefix: string
}

interface ActionInformation {
  controllerName: string
  methodName: string
  httpVerb: HttpVerb
  path: string
}

class RouteCollection {
  private controllerInformations: ControllerInformations[]
  private actionInformations: ActionInformation[]

  constructor() {
    this.controllerInformations = []
    this.actionInformations = []
  }

  registerController(ctor: new (...args: any[]) => any, prefix: string): void {
    this.controllerInformations.push({ controllerName: ctor.name, ctor, prefix })
  }

  registerAction(controllerName: string, methodName: string, httpVerb: HttpVerb, path?: string): void {
    this.actionInformations.push({ controllerName, methodName, httpVerb, path: path || "" })
  }

  setupRouter(router: Router) {
    this.controllerInformations.forEach((c: ControllerInformations) => {
      const injections = Reflect.getOwnMetadata(INJECTIONS_METADATA_KEY, c.ctor)

      const dependencies: unknown[] = []
      Object.keys(injections)
        .map((k) => parseInt(k, 10))
        .sort((a, b) => (a < b ? -1 : 1))
        .forEach((key) => {
          dependencies.push(dependencyService.resolve(injections[key]))
        })

      const controller = new c.ctor(...dependencies)
      const actions = this.actionInformations.filter((a: ActionInformation) => a.controllerName === c.controllerName)

      actions.forEach((a: ActionInformation) => {
        const action = controller[a.methodName].bind(controller)
        const route = `/${c.prefix}/${a.path}`
        router[a.httpVerb](route, asyncMiddleware(action))
      })
    })
  }
}

const routeCollection = new RouteCollection()

export { routeCollection, HttpVerb }
