import Router from "koa-router";
import * as users from "../models/users";
const router = new Router({
  prefix: "/users",
});

router.get("/", async (ctx) => {
  ctx.body = await users.getAll();
});

router.get("/:id", async (ctx) => {
  const id = parseInt(ctx.params.id);
  ctx.body = await users.getById(id);
});
