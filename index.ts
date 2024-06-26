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
import app from "./app";

declare global {
  namespace Express {
    interface User extends UserModel {}
  }
}

async function run() {
  await sequelize.authenticate();
  if (process.env.NODE_ENV !== "test") {
    await sequelize.sync();
  }

  app.listen(10888, () => {
    console.log("Koa Started");
  });
}

run();
