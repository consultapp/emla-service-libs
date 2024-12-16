import { ElmaUMDController } from './ElmaUMDController'

type TEventName = (n: string) => string
type Props = {
  eventName: TEventName
  dependencies: string[]
}

console.log('ElmaUMDController', ElmaUMDController)

export class ElmaReactLauncher {
  props: Props = {
    eventName: () => `${this._moduleName}-loaded`,
    dependencies: [],
  }
  constructor(private _moduleName: string, props: Props) {
    Object.assign(this.props, props)
    this.#init()
  }
  #init() {}
}
