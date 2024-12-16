if (typeof Promise.withResolvers === 'undefined') {
  Promise.withResolvers = <T>() => {
    let resolve: (value: T | PromiseLike<T>) => void
    let reject: (reason?: unknown) => void
    const promise = new Promise<T>((res, rej) => {
      resolve = res
      reject = rej
    })
    return { promise, resolve: resolve!, reject: reject! }
  }
}

type TEventName = (n: string) => string
type Props = {
  listen?: boolean
  wait?: boolean
  timeout?: number
  attempts?: number
  log?: boolean
  eventName: TEventName
}

export class ElmaUMDController {
  private umdPromise: ReturnType<typeof Promise.withResolvers<void>> =
    Promise.withResolvers()
  private controller: AbortController = new AbortController()
  private attempt: number = 0
  props: Props = {
    eventName: () => `${this._moduleName}-loaded`,
    listen: true,
    wait: true,
    timeout: 50,
    attempts: 50,
    log: false,
  }

  setTimeout = () => {
    if (this._moduleName in window) return this.umdPromise.resolve()

    this.#log(`waiting... Attempt: ${this.attempt}`)

    if (this.attempt++ < 20)
      return window.setTimeout(this.setTimeout, this.props.timeout ?? 20)

    if (this.attempt > 20) {
      this.#log(`rejected. attempts limit.`)
      this.umdPromise.reject()
    }
  }

  constructor(private _moduleName: string, props: Props) {
    Object.assign(this.props, props)
    this.#init()
  }

  #init() {
    this.#wait()
    this.#addListener()

    return this.umdPromise.promise
  }

  #wait() {
    if (!this.props.wait) return
    this.setTimeout()
  }

  #addListener() {
    if (!this.props.listen) return

    document.addEventListener(
      this.props.eventName(this._moduleName),
      () => {
        this.umdPromise.resolve()
        this.controller.abort()
      },
      {
        signal: this.controller.signal,
      }
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  #log(...args: any) {
    if (this.props.log)
      console.log('ElmaUMDController:', `${this._moduleName}:`, ...args)
  }

  get moduleName(): string {
    return this.moduleName
  }

  get promise() {
    return this.umdPromise.promise
  }

  loaded() {
    this.umdPromise.resolve()
  }

  onLoad(cb: () => void) {
    this.umdPromise.promise.then(() => {
      cb()
    })
  }
}
