import { User } from '../models/User';

export interface ExpressRequest extends Request {
  user?: User;
}
