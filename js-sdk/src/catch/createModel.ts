import {
  getTypeByMessage,
  getCurrentRouter
} from './utils'
import {
  projectName,
  customInfo
} from './index'

export type ErrorDetail = string | Error | Object
interface IErrorBase {
  projectName: string,
  errorType: string,
  router: {
    pathname: string,
    origin: string
  },
  happenTime: Number,
  customInfo?:any
  // user-agent 服务端收集，在headers中存在
}
interface IRuntimeError extends IErrorBase {
  source?:string,
  message: Event | string,
  lineno: Number,
  colno: Number,
  errorDetail: ErrorDetail
}

interface IResourceError extends IErrorBase {
  source: string,
  errorDetail: ErrorDetail
}

interface IPromiseError extends IErrorBase {
  message: string,
  errorDetail?: ErrorDetail
}

/**
 * 备注：后续考虑会改成 函数重载 的方式实现创建 ErrorModel
 */

export const createRuntimeErrorModel = (
  message: Event | string, 
  lineno: Number,
  colno: Number, 
  error: ErrorDetail,
  source?: string,
  errorType?: string
):IRuntimeError => {
  return {
    projectName,
    customInfo,
    happenTime: new Date().getTime(),
    message,
    errorType: errorType || getTypeByMessage(message as string),
    router: getCurrentRouter(),
    source,
    lineno,
    colno,
    errorDetail: error
  }
}

export const createResourceModel = (
  sourceURL: string,
  error: ErrorDetail
):IResourceError => {
  return {
    projectName,
    customInfo,
    happenTime: new Date().getTime(),
    errorType: 'Uncaught ResourceError',
    router: getCurrentRouter(),
    source: sourceURL,
    errorDetail: error
  }
}

export const createPromiseModel = (
  message: string,
  error?: ErrorDetail
):IPromiseError => {
  return {
    projectName,
    customInfo,
    message,
    happenTime: new Date().getTime(),
    errorType: 'Uncaught PromiseError',
    router: getCurrentRouter(),
    errorDetail: error
  }
}
