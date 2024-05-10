import Router from "koa-router";
import * as dogs from "../models/dogs";
import passport from "koa-passport";
import { requireRole } from "../utils/requireRole";
const router = new Router({
  prefix: "/dogs",
});

router.get("/", async (ctx) => {
  // get all dogs
  ctx.body = await dogs.getAll();
});
router.get("/:id", async (ctx) => {
  // get one dog
  const dog = await dogs.getById(parseInt(ctx.params.id));
  if (!dog) {
    ctx.status = 404;
    ctx.message = "Dog not found";
    return;
  }
  ctx.body = dog;
});
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  requireRole(["worker"]),
  async (ctx) => {
    // create a dog
    const insertBody = ctx.request.body as any;
    insertBody.charityId = ctx.state.user.charityId;
    const newDog = await dogs.create(insertBody as any);
    ctx.body = newDog;
  }
);
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  requireRole(["worker"]),
  async (ctx) => {
    const dog = await dogs.getById(parseInt(ctx.params.id));
    if (!dog) {
      ctx.status = 404;
      ctx.message = "Dog not found";
      return;
    }

    if (ctx.state.user.charityId !== dog.charityId) {
      ctx.status = 403;
      return;
    }
    const updateBody = ctx.request.body;
    const updatedDog = await dogs.update(
      parseInt(ctx.params.id),
      updateBody as any
    );

    ctx.body = updatedDog;
  }
);
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  requireRole(["worker"]),
  async (ctx) => {
    const dog = await dogs.getById(parseInt(ctx.params.id));
    if (!dog) {
      ctx.status = 404;
      ctx.message = "Dog not found";
      return;
    }

    if (ctx.state.user.charityId !== dog.charityId) {
      ctx.status = 403;
      return;
    }
    const success = await dogs.remove(parseInt(ctx.params.id));
    ctx.body = success;
    ctx.status = success ? 200 : 404;
  }
);

export { router };
