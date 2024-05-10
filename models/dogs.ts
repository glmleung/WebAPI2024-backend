import { db } from "../database";

export type Dog = {
  id: number;
  name: string;
  age: number;
  breed: string;
};

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
  return db.models.dogs.findByPk(id);
};

export const getAll = async () => {
  return db.models.dogs.findAll();
};

export const create = async (dog: CreateDogInput) => {
  return db.models.dogs.create(dog);
};

export const update = async (id: number, dog: UpdateDogInput) => {
  const existingDog = await getById(id);
  if (!existingDog) {
    return null;
  }

  await db.models.dogs.update(dog, {
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

  await existingDog.destroy()
  return true;
};
