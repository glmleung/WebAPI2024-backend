import Koa from "koa";
import bodyParser from "koa-bodyparser";
import json from "koa-json";
import logger from "koa-logger";
import passport from "koa-passport";
import serve from "koa-static";
import cors from "@koa/cors";
import { router as charityRoutes } from "./routes/charity.routes";
import { router as dogRoutes } from "./routes/dogs.routes";
import { router as authRoutes } from "./routes/auth.routes";
import { sequelize } from "./database";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { User as UserModel, getById as getUserById } from "./models/users";
import bcrypt from "bcrypt";

declare global {
  namespace Express {
    interface User extends UserModel {}
  }
}

async function run() {
  await sequelize.authenticate();
  await sequelize.sync({ force:true });
  const app: Koa = new Koa();
  app.use(cors());
  app.use(serve("./docs"));
  app.use(passport.initialize());
  app.use(json());
  app.use(logger());
  app.use(bodyParser());

 
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: "secret",
      },
      async (jwt, done) => {
        const user = await getUserById(jwt.id);
        if (user) {
          return done(null, user);
        } else {
          return done(null, null);
        }
      }
    )
  );

  app.use(authRoutes.routes());
  app.use(authRoutes.allowedMethods());
  app.use(dogRoutes.routes());
  app.use(dogRoutes.allowedMethods());
  app.use(charityRoutes.routes());
  app.use(charityRoutes.allowedMethods());
  app.listen(10888, () => {
    console.log("Koa Started");
  });
}

run();
