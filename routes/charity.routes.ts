import Router from "koa-router";
import * as charities from "../models/charities";

const router = new Router({
  prefix: "/charities",
});

router.get("/", async (ctx) => {
  // get all charities
  ctx.body = await charities.getAll();
});
router.get("/:id", async (ctx) => {
  // get one charity
  const charity = await charities.getById(parseInt(ctx.params.id));
  if (!charity) {
    ctx.status = 404;
    ctx.message = "Charity not found";
    return;
  }
  ctx.body = charity;
});

router.post("/", async (ctx) => {
  // create a charity
  const insertBody = ctx.request.body;
  const newCharity = await charities.create(insertBody as any);
  ctx.body = newCharity;
});
router.put("/:id", async (ctx) => {
  // update a charity
  const updateBody = ctx.request.body;
  const updatedCharity = await charities.update(
    parseInt(ctx.params.id),
    updateBody as any
  );
  if (!updatedCharity) {
    ctx.status = 404;
    ctx.message = "Charity not found";
    return;
  }
  ctx.body = updatedCharity;
});
router.delete("/:id", async (ctx) => {
  // delete a charity
  const success = await charities.remove(parseInt(ctx.params.id));
  ctx.body = success;
  ctx.status = success ? 200 : 404;
});

export { router };
