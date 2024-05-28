import passport from "koa-passport";
import Router from "koa-router";
import * as likes from "../models/likes";
const router = new Router({
  prefix: "/users",
});

router.get(
  "/likedDogs",
  passport.authenticate("jwt", { session: false }),

  async (ctx) => {
    const userId = ctx.state.user.id;
    // console.log({userId})

    ctx.body = await likes.getLikedDogsByUserId(userId);
  }
);

export { router };
