import { 
  catchRuntimeError,
  catchPromiseError,
  catchResourceError
} from './basicError'
import {
  interceptConsoleError,
  interceptConsoleWarn,
  interceptEventListener
} from './hooks'
import { getRuntimeCodePosition } from './utils'
import { createRuntimeErrorModel, ErrorDetail  } from './createModel'

export let projectName:string
export let customInfo:String
export let reportingInterval:Number
// 注册 上报 接口（错误收集、上报模块完全分离）
export let reportError: Function = () => void(0)
export function registerReportError(fn: Function) {
  const reportConfig = {
    reportingInterval
  }
  reportError = function(errorModel:any) {
    console.log('reportError', errorModel, reportConfig)

    fn(errorModel, reportConfig)
  }
}

// 用户主动捕获异常 API
export function takeCatchError(message: string, detail?: ErrorDetail) {
  const { lineno, colno, source } = getRuntimeCodePosition()
  const customError = createRuntimeErrorModel(
    message,
    lineno,
    colno,
    detail || '',
    source,
    'Uncaught Custom'
  )

  // console.log('customError: ', customError)
  reportError(customError)
}

/**
 * 函数捕获错误的装饰器
 * 解决：无法捕获 调用 script引用不同域 JS 文件 中方法执行发生的错误
 * @param fn [Function] 需要捕获的方法
 * @returns Function
 */
 export function catchErrorDecorator(fn:any):Function{
  if (!fn.__wrapped__) {
    fn.__wrapped__ = function () {
      try {
        return fn.apply(this, arguments)
      } catch (e) {
        // 如果这个方法发生错误，则抛出一个异常让外部捕获
        throw e
      }
    }
  }

  return fn.__wrapped__
}

/**
 * config配置
 *  catchConsoleError: true / false
 *  catchConsoleWarn: true / false
 *  reportingInterval: Number  上
 *  catchCrossScriptError: true / false
 */

interface IConfig {
  projectName: string,
  catchConsoleError?: Boolean, // 捕获console.error()
  catchConsoleWarn?: Boolean, // 捕获console.warn()
  catchCrossScriptError?: Boolean, // 捕获跨域 script脚本错误
  reportingInterval?: Number, // 报间隔时间，默认发生即可上报,
  customInfo?: any
}

// TODO 还需要测试
// 用户注册入口 API
export function register(config: IConfig) {
  console.log('register ok!!!')
  if(!config.projectName) {
    console.warn('Not projectName!!!', false)
  }
  if(config.reportingInterval) {
    reportingInterval = config.reportingInterval
  }
  catchRuntimeError()
  catchPromiseError()
  catchResourceError()
  projectName = config.projectName as string
  customInfo = config.customInfo
  if(config.catchConsoleError) {
    interceptConsoleError()
  } else if(config.catchConsoleWarn) {
    interceptConsoleWarn()
  } else if(config.catchCrossScriptError) {
    interceptEventListener()
  }
}
