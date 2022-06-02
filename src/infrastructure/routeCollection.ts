import { Router } from "express"

type HttpVerb = "get"

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
  private actionInformation: ActionInformation[]

  constructor() {
    this.controllerInformations = []
    this.actionInformation = []
  }

  registerController(ctor: new (...args: any[]) => any, prefix: string): void {
    this.controllerInformations.push({ controllerName: ctor.name, ctor, prefix })
  }

  registerAction(controllerName: string, methodName: string, httpVerb: HttpVerb, path?: string): void {
    this.actionInformation.push({ controllerName, methodName, httpVerb, path: path || "" })
  }

  setupRouter(router: Router) {
    this.controllerInformations.forEach((c: ControllerInformations) => {
      const controller = new c.ctor()
      const actions = this.actionInformation.filter((a: ActionInformation) => a.controllerName === c.controllerName)

      actions.forEach((a: ActionInformation) => {
        const action = controller[a.methodName].bind(controller)
        const route = `/${c.prefix}/${a.path}`
        router[a.httpVerb](route, action)
      })
    })
  }
}

const routeCollection = new RouteCollection()

export { routeCollection, HttpVerb }
