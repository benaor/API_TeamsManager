import { HttpVerb, routeCollection } from "../infrastructure/routeCollection"

const action = (httpVerb: HttpVerb, path?: string) => {
  const decorator: MethodDecorator = (target: any, key: string | Symbol, descriptor: PropertyDescriptor) => {
    routeCollection.registerAction(target.constructor.name, String(key), httpVerb, path)
  }

  return decorator
}

const Get = (path?: string) => action("get", path)
const Post = (path?: string) => action("post", path)

export { Get, Post }
