// import jwt from "jsonwebtoken";
// import authConfig from "@config/auth.json";
// import { Request, Response, NextFunction } from "express";
// import { User } from "@entities/User";
// import { getRepository } from "typeorm";

// export async function authMiddleware(
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) {
//   const authHeader = req.headers.authorization;

//   if (!authHeader) {
//     return res
//       .status(401)
//       .send({ message: "Token de requisição não informado" });
//   }

//   const parts = authHeader.split(" ");

//   if (!(parts.length === 2)) {
//     return res.status(401).send({ message: "Token inválido" });
//   }

//   const [scheme, token] = parts;

//   if (scheme !== "Bearer") {
//     return res.status(401).send({ message: "Token malformatado" });
//   }

//   jwt.verify(token, authConfig.secret, async (err, decoded) => {
//     if (err) {
//       return res.status(401).send({ message: "Token inválido" });
//     }

//     const user = await getRepository(User).findOne(decoded.id);

//     if (!user) {
//       return res.status(401).send({ message: "Usuário inválido" });
//     }

//     req.user = user;

//     return next();
//   });
// }
