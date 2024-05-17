import Router from "koa-router";
import * as dogs from "../models/dogs";
import * as likes from "../models/likes";
import passport from "koa-passport";
import { requireRole } from "../utils/requireRole";
const router = new Router({
  prefix: "/dogs",
});

router.get("/", async (ctx) => {
  // get all dogs
  ctx.body = await dogs.getAll({loadCharity:true});
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

router.post("/:id/like", passport.authenticate("jwt", { session: false }), async (ctx) => {
  const userId = ctx.state.user.id;
  const dogId = parseInt(ctx.params.id);
  await likes.createLike(userId, dogId).catch(e => {
    // ignore duplicate like
  });
  ctx.status = 201
})
router.delete("/:id/like", passport.authenticate("jwt", { session: false }), async (ctx) => {
  const userId = ctx.state.user.id;
  const dogId = parseInt(ctx.params.id);
  await likes.removeLike(userId, dogId).catch(e => {
    // ignore if like doesn't exist
  });
  ctx.status = 204
})
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
