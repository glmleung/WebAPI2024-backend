import {
  Sequelize,
  QueryTypes,
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";

export class Dog extends Model<InferAttributes<Dog>, InferCreationAttributes<Dog>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare age: number;
  declare breed: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export type CreateDogInput = {
  name: string;
  age: number;
  breed: string;
};

export type UpdateDogInput = {
  name: string;
  age: number;
  breed: string;
};

export const getById = async (id: number) => {
  return Dog.findByPk(id);
};

export const getAll = async () => {
  return Dog.findAll();
};

export const create = async (dog: CreateDogInput) => {
  return Dog.create(dog);
};

export const update = async (id: number, dog: UpdateDogInput) => {
  const existingDog = await getById(id);
  if (!existingDog) {
    return null;
  }

  await Dog.update(dog, {
    where: {
      id: id,
    },
  });

  return getById(id);
};

export const remove = async (id: number): Promise<boolean> => {
  const existingDog = await getById(id);
  if (!existingDog) {
    return false;
  }

  await existingDog.destroy();
  return true;
};
