import { IUser } from "../interfaces/user/user.interface";

// declare global
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}
