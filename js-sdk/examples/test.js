document.getElementById('testBtn').onclick=function() {
  // console.warn('custom error msg!!!')
  console.error({ code: 300, msg: 'custom error msg!!!' })
  // console.log(a)
}
