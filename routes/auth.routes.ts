
import Router from "koa-router";
import { User } from "../models/users";
import bcrypt from "bcrypt";
import passport from "koa-passport";
import { jwtSign } from "../jwtSign";
const router = new Router({
  prefix: "/auth",
});

router.post("/register", async (ctx,next) => {
  const {username, password} = ctx.request.body as any;
  if(!username || !password){
    ctx.status = 400;
    return}

    const exist =await User.findOne({where:{username}})
    if(exist){
      ctx.status = 409;
      return
    }
    const hashedPassword = bcrypt.hashSync(password, 10);
    const user = await User.create({username, password: hashedPassword, role:''});
    ctx.status = 201;
    // return
    ctx.body = {
      username,
      token: jwtSign({
        id: user.id,
      })
    }

});
router.post("/login", async ctx => {
  const {username, password} = ctx.request.body as any;
  if(!username || !password){
    ctx.status = 400;
    return}

    const user =await User.findOne({where:{username}})
    if(!user){
      ctx.status = 401;
      return
    }
    if(bcrypt.compareSync(password, user.password)){
      ctx.body = {
        username,
        token: jwtSign({
          id: user.id,
        })
      }
    }else{
      ctx.status = 401;
    }

})
router.get("/me", passport.authenticate("jwt", { session: false }),  ctx => {

  if(!ctx.isAuthenticated()) {
    ctx.status = 401;
    return;
  }
  ctx.body = ctx.state.user;
})

export { router };
