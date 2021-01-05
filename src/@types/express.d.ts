import { User } from "@entities/User";
import { Socket } from "socket.io";
declare global {
  namespace Express {
    interface Request {
      user?: User;
      io?: Socket;
    }
  }
}
