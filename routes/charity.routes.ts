import Router from "koa-router";
import * as charities from "../models/charities";
import passport from "koa-passport";
import { requireRole } from "../utils/requireRole";

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

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  requireRole(["admin"]),
  async (ctx) => {
    // create a charity
    const insertBody = ctx.request.body;
    const newCharity = await charities.create(insertBody as any);
    ctx.body = newCharity;
  }
);
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  requireRole(["admin", "worker"]),
  async (ctx) => {
    if (
      ctx.state.user === "worker" &&
      ctx.state.user.charityId !== parseInt(ctx.params.id)
    ) {
      ctx.status = 403;
      return;
    }
    const id = parseInt(ctx.params.id);
    // update a charity
    const updateBody = ctx.request.body;
    const updatedCharity = await charities.update(id, updateBody as any);
    if (!updatedCharity) {
      ctx.status = 404;
      ctx.message = "Charity not found";
      return;
    }
    ctx.body = updatedCharity;
  }
);
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  requireRole(["admin"]),
  async (ctx) => {
    const success = await charities.remove(parseInt(ctx.params.id));
    ctx.body = success;
    ctx.status = success ? 200 : 404;
  }
);

export { router };
