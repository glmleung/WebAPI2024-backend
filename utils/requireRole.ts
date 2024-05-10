import { Middleware } from "koa";

export const requireRole = (roles: string[]):Middleware => {
  return async (ctx, next) => {
    if(!ctx.state.user){
      ctx.status = 401;
      return
    }
    if(!roles.includes(ctx.state.user.role)){
      ctx.status = 403;
      return
    }
    return next()
  }
}