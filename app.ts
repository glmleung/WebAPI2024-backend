import cors from "@koa/cors";
import Koa from "koa";
import bodyParser from "koa-bodyparser";
import json from "koa-json";
import logger from "koa-logger";
import passport from "koa-passport";
import serve from "koa-static";
import { ExtractJwt, Strategy as JwtStrategy } from "passport-jwt";
import { getById as getUserById } from "./models/users";
import { router as authRoutes } from "./routes/auth.routes";
import { router as charityRoutes } from "./routes/charity.routes";
import { router as dogRoutes } from "./routes/dogs.routes";

const app: Koa = new Koa();
app.use(cors());
app.use(serve("./docs"));
app.use(passport.initialize());
app.use(json());
app.use(logger());
app.use(bodyParser({ jsonLimit: "5mb" }));

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

export default app;
