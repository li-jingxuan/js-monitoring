/**
 * JavaScript Basic error collection
 */

import { 
  reportError
} from './index'
import {
  createRuntimeErrorModel,
  createResourceModel,
  createPromiseModel
} from './createModel'
import { 
  getTypeof
} from './utils'

export function catchRuntimeError():void {
  window.onerror = function(
    message: Event | string, 
    source?: string, 
    lineno?: number, 
    colno?: number, 
    error?: Error
  ) {
    const errorModel = createRuntimeErrorModel(
      message, 
      lineno || -1,
      colno || -1, 
      error || '', 
      source || '' as string
    )
    // console.log('catchRuntimeError', errorModel)

    reportError(errorModel)
  }
}

export function catchPromiseError():void {
  // XXX 目前无法获取到 行列 位置
  window.addEventListener('unhandledrejection', function(event:any) {
    let error = event.reason
    let message = `Uncaught PromiseError`

    if(typeof error === 'object') {
      if(error.msg || error.message) {
        message = `Uncaught PromiseError: ${error.msg || error.message}`
      }

      error = JSON.stringify(event.reason)
    } else {
      message = `Uncaught PromiseError: ${error}`
    }
    const promiseErrorModel = createPromiseModel(message, `Uncaught PromiseError: ${error}`)

    // console.log('promiseErrorModel', event, promiseErrorModel)
    reportError(promiseErrorModel)
  })
}

export function catchResourceError():void {
  window.addEventListener('error', function(event:any) {
    if(getTypeof(event.target) !== 'Window') {
      const resourceError = createResourceModel(event.target?.src, '')
      // console.log('catchResourceEsrror', resourceError) 

      reportError(resourceError)
    }
  }, true)
}
