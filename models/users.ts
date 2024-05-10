import {
  Sequelize,
  QueryTypes,
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

export class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare id: CreationOptional<number>;
  declare username: string;
  declare password: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export type CreateUserInput = InferCreationAttributes<User>

export type UpdateUserInput = InferCreationAttributes<User>

export const getById = async (id: number) => {
  return User.findByPk(id);
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
