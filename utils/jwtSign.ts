import { sign } from "jsonwebtoken";

export const jwtSign = (payload: any) => {
  return sign(payload, "secret", {
    expiresIn: "7d",
  });
};
