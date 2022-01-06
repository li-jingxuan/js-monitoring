export const getTypeof = (obj:Object):string => Object.prototype.toString.call(obj).slice(8, -1)

export const isInteger = (num:string):Boolean => Number.isInteger(Number(num))

export const getTypeByMessage = (message:string):string => message.split(':')[0]

export const getCurrentRouter = ():{ pathname: string, origin: string } => {
  const { pathname, origin } = window.location
  return { pathname, origin }
}

export function getRuntimeCodePosition():{ 
  lineno: Number, 
  colno: Number, 
  source: string, 
  errText: string 
} {
  // 抛出一个异常消息，让 window.onerror 去捕获
  const e = new Error()
  const errText = e.stack as string

  const sourcePos = errText.match(/http[s]?:\/\/.+:\d+/g)
  
  let lineno:Number = -1
  let colno:Number = -1
  let source:string=''

  if(sourcePos && sourcePos.length > 0) {
    const sourceRes = sourcePos.pop()!.split(':')
    const linenoRes = sourceRes.pop()
    const colnoRes = sourceRes.pop()
    source = sourceRes.join(':')
    if(linenoRes && isInteger(linenoRes)) {
      lineno = Number(linenoRes)
    }
    if(colnoRes && isInteger(colnoRes)){ 
      colno = Number(colnoRes)
    }
  }

  return { errText, lineno, colno, source }
}
