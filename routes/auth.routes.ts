import Router from "koa-router";
import * as users from "../models/users";
import * as charities from "../models/charities";

import bcrypt from "bcrypt";
import passport from "koa-passport";
import { jwtSign } from "../utils/jwtSign";
const router = new Router({
  prefix: "/auth",
});

router.post("/register", async (ctx, next) => {
  const { username, password, charityCode } = ctx.request.body as any;
  if (!username || !password) {
    ctx.status = 400;
    return;
  }
  let charity;
  let role = "user";
  if (charityCode) {
    if (charityCode === "admin") {
      role = "admin";
    } else {
      charity = await charities.getByCode(charityCode);
      if (!charity) {
        ctx.status = 404;
        ctx.message = "invalid code";
        return;
      }
      role = "worker";
    }
  }
  const exist = await users.getByUsername(username);
  if (exist) {
    ctx.status = 409;
    return;
  }
  const hashedPassword = bcrypt.hashSync(password, 10);
  const user = await users.create({
    username,
    password: hashedPassword,
    role,
    charityId: charity?.id,
  });
  ctx.status = 201;
  // return
  ctx.body = {
    token: jwtSign({
      id: user.id,
    }),
  };
});
router.post("/login", async (ctx) => {
  const { username, password } = ctx.request.body as any;
  if (!username || !password) {
    ctx.status = 400;
    return;
  }

  const user = await users.getByUsername(username);
  if (!user) {
    ctx.status = 401;
    return;
  }
  if (bcrypt.compareSync(password, user.password)) {
    ctx.body = {
      token: jwtSign({
        id: user.id,
      }),
    };
  } else {
    ctx.status = 401;
  }
});
router.get("/me", passport.authenticate("jwt", { session: false }), (ctx) => {
  if (!ctx.isAuthenticated()) {
    ctx.status = 401;
    return;
  }
  ctx.body = ctx.state.user;
});

export { router };
