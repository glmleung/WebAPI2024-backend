import Koa from "koa";
import bodyParser from "koa-bodyparser";
import json from "koa-json";
import logger from "koa-logger";
import passport from "koa-passport";
import serve from "koa-static";
import cors from "@koa/cors";
import { router as dogRoutes } from "./routes/dogs.routes";
import { sequelize } from "./database";

async function run() {
  await sequelize.authenticate()
  await sequelize.sync({ force: true });
  const app: Koa = new Koa();
  app.use(cors());
  app.use(serve("./docs"));

  app.use(json());
  app.use(logger());
  app.use(bodyParser());
  app.use(passport.initialize());

  app.use(dogRoutes.routes());
  app.use(dogRoutes.allowedMethods());
  app.listen(10888, () => {
    console.log("Koa Started");
  });
}

run();
