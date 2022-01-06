import resolve from 'rollup-plugin-node-resolve' // 依赖引用插件
import commonjs from 'rollup-plugin-commonjs' // commonjs模块转换插件
import { eslint } from 'rollup-plugin-eslint' // eslint插件
import typescript from 'rollup-plugin-typescript2'
import path from 'path'

console.log(path.resolve(__dirname, 'src', 'main.ts'))
const extensions = ['.js', '.ts']
export default {
  input: path.resolve(__dirname, 'src', 'main.ts'),
  output: {
    file: 'dist/js-sdk.js',
    format: 'umd',
    name: 'file'
  },
  watch: {
    include: 'src/**',
    exclude: 'node_modules/**'
  },
  plugins: [
    resolve(extensions),
    commonjs(),
    typescript({
      tsconfig: path.resolve(__dirname, 'tsconfig.json'), // 导入本地ts配置
      extensions
    }),
    eslint({
      throwOnError: true,
      include: ['src/**/*.ts'],
      exclude: ['node_modules/**', 'dist/**']
    })
  ]
}