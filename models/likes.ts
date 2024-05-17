import {
  Sequelize,
  QueryTypes,
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  NonAttribute,
  CreationAttributes,
} from "sequelize";
import { User } from "./users";
import { Dog } from "./dogs";
export class Like extends Model<
  InferAttributes<Like>,
  InferCreationAttributes<Like>
> {
  declare userId: ForeignKey<User["id"]>;
  declare user: NonAttribute<User>;
  declare dogId: ForeignKey<Dog["id"]>;
  declare dog: NonAttribute<Dog>;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}


export const createLike = async (userId: number, dogId: number) => {
  return Like.create({
    dogId,userId
  });
}

export const removeLike = async (userId: number, dogId: number) => {
  return Like.destroy({
    where:{
      dogId,userId
    }
  });
}


