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
import { Charity } from "./charities";
import { Dog } from "./dogs";
import { Like } from "./likes";

export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  declare id: CreationOptional<number>;
  declare username: string;
  declare password: string;
  declare charityId?: ForeignKey<Charity["id"]>;
  declare charity?: NonAttribute<Charity>;
  declare role: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare likedDogs: NonAttribute<Like[]>;
}

export type CreateUserInput = CreationAttributes<User>;

export type UpdateUserInput = CreationAttributes<User>;

export const getById = async (id: number) => {
  return User.findByPk(id, { attributes: { exclude: ["password"] } });
};

export const getByUsername = async (username: string) => {
  return User.findOne({
    where: {
      username,
    },
  });
};

export const getAll = async () => {
  return User.findAll();
};

export const create = async (user: CreateUserInput) => {
  return User.create(user);
};

export const update = async (id: number, user: UpdateUserInput) => {
  const existingUser = await getById(id);
  if (!existingUser) {
    return null;
  }

  await User.update(user, {
    where: {
      id: id,
    },
  });

  return getById(id);
};

export const remove = async (id: number): Promise<boolean> => {
  const existingUser = await getById(id);
  if (!existingUser) {
    return false;
  }

  await existingUser.destroy();
  return true;
};
