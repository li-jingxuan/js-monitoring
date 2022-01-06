export {
  catchErrorDecorator,
  register,
  takeCatchError
} from '../catch'
import { registerReportError } from '../catch'

registerReportError(() => {})