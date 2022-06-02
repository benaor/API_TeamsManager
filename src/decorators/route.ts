import { HttpVerb, routeCollection } from "../infrastructure/routeCollection"

const action = (httpVerb: HttpVerb, path?: string) => {
  const decorator: MethodDecorator = (target: any, key: string | Symbol, descriptor: PropertyDescriptor) => {
    routeCollection.registerAction(target.constructor.name, String(key), httpVerb, path)
  }

  return decorator
}

const get = (path?: string) => action("get", path)

export { get }
