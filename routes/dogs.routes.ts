import Router from "koa-router";
import * as dogs from "../models/dogs";

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
router.post("/", async (ctx) => {
  // create a dog
  const insertBody = ctx.request.body;
  const newDog = await dogs.create(insertBody as any);
  ctx.body = newDog;
});
router.put("/:id", async (ctx) => {
  // update a dog
  const updateBody = ctx.request.body;
  const updatedDog = await dogs.update(
    parseInt(ctx.params.id),
    updateBody as any
  );
  if (!updatedDog) {
    ctx.status = 404;
    ctx.message = "Dog not found";
    return;
  }
  ctx.body = updatedDog;
});
router.delete("/:id", async (ctx) => {
  // delete a dog
  const success = await dogs.remove(parseInt(ctx.params.id));
  ctx.body = success;
  ctx.status = success ? 200 : 404;
});

export { router };
