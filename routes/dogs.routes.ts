import Router from "koa-router";

const router = new Router({
  prefix: "/dogs",
});

router.get("/", async (ctx) => {
  // get all dogs
  ctx.body = [];
});
router.get("/:id", async (ctx) => {
  // get one dog
  ctx.body = {};
});
router.post("/", async (ctx) => {
  // create a dog
  ctx.body = [];
});
router.put("/:id", async (ctx) => {
  // update a dog
  ctx.body = {};
});
router.delete("/:id", async (ctx) => {
  // delete a dog
  ctx.body = {};
});

export { router };
