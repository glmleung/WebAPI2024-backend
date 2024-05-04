import { QueryTypes } from "sequelize";
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
  const dogs = await db.query(`select * from dogs where id = ? limit 1`, {
    replacements: [id],
    type: QueryTypes.SELECT,
  });
  return dogs[0] || null;
};

export const getAll = async () => {
  const dogs = await db.query(`select * from dogs`, {
    type: QueryTypes.SELECT,
  });
  return dogs;
};

export const create = async (dog: CreateDogInput) => {
  const [results, meta] = await db.query(
    `insert into dogs (name, age, breed) values (?, ?, ?) returning *`,
    {
      replacements: [dog.name, dog.age, dog.breed],
      type: QueryTypes.INSERT,
    }
  );

  return (results as any)[0];
};

export const update = async (id: number, dog: UpdateDogInput) => {
  const existingDog = await getById(id);
  if (!existingDog) {
    return null;
  }

  await db.query(`update dogs set name = ?, age = ?, breed = ? where id = ?`, {
    replacements: [dog.name, dog.age, dog.breed, id],
    type: QueryTypes.UPDATE,
  });

  return getById(id);
};

export const remove = async (id: number): Promise<boolean> => {
  const existingDog = await getById(id);
  if (!existingDog) {
    return false;
  }
  await db.query(`delete from dogs where id = ?`, {
    replacements: [id],
    type: QueryTypes.DELETE,
  });
  return true;
};
