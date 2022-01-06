import { getRuntimeCodePosition } from './utils'
import {
  createRuntimeErrorModel
} from './createModel'
import { reportError } from './index'

const enum ConsoleType {
  ConsoleError = 'ConsoleError',
  ConsoleWarn = 'ConsoleWarn',
  // ConsoleLog = 'ConsoleLog'
}

/* hooks 重写 JavaScript 中的部分 原生方法 达到监听错误的目的 */

function createConsoleBaseFn(type:string) {
  let oldConsoleError = console.error
  
  if(type === ConsoleType.ConsoleWarn) {
    oldConsoleError = console.warn
  }
  return function () {
    const args = Array.prototype.slice.call(arguments)
    
    oldConsoleError.apply(console, args)
    // 若最后一个参数为 false，不进行上报
    if(args.length > 1 && args.pop() === false) {
      return
    }

    // 只提交 console.error 的第一个参数
    let message: any = args[0]
    
    if(typeof message === 'object') {
      message = JSON.stringify(message)
    }
    
    const {
      lineno,
      colno,
      errText,
      source
    } = getRuntimeCodePosition()
    const runtimeError = createRuntimeErrorModel(
      `Uncaught ${type}:${message}`,
      lineno,
      colno,
      errText,
      source
    )
    
    // console.log('errText: ', runtimeError)
    reportError(runtimeError)
  } 
}

export function interceptConsoleError():void {
  console.error = createConsoleBaseFn(ConsoleType.ConsoleError)
}

export function interceptConsoleWarn():void {
  console.warn = createConsoleBaseFn(ConsoleType.ConsoleWarn)
}

/**
 * 解决：script 引用 不同域下 的 js 事件中发生错误 将无法被捕捉到
 */
export function interceptEventListener():void {
  const originAddEventListener = EventTarget.prototype.addEventListener
  EventTarget.prototype.addEventListener = function (type:string , listener:any, options:any) {
    const wrappedListener = function (this:any, ...args:any) {
      try {
        return listener.apply(this, args)
      } catch (err) {
        // 抛出一个异常使得外部可以被 window.onerror 事件捕获
        throw err
      }
    }

    return originAddEventListener.call(this, type, wrappedListener, options);
  }
}
