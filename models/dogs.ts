import {
  Sequelize,
  QueryTypes,
  DataTypes,
  fn,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  ForeignKey,
  NonAttribute,
  CreationAttributes,
  Includeable,
  col,
} from "sequelize";
import { Charity } from "./charities";
import { Like } from "./likes";

export class Dog extends Model<
  InferAttributes<Dog>,
  InferCreationAttributes<Dog>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare age: number;
  declare breed: string;
  declare charityId: ForeignKey<Charity["id"]>;
  declare charity: NonAttribute<Charity>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare likedByUsers: NonAttribute<Like[]>;
}

export type CreateDogInput = CreationAttributes<Dog>;

export type UpdateDogInput = CreationAttributes<Dog>;

export const getById = async (id: number) => {
  return Dog.findByPk(id, {});
};

export const getAll = async (options?: {
  charityId?: number;
  loadCharity?: boolean;
  userId?: number;
}) => {
  if (options?.charityId) {
    return Dog.findAll({
      where: {
        charityId: options.charityId,
      },
      order: [["id", "desc"]],
    });
  }
  let include: Includeable[] = [];
  if (options?.loadCharity) {
    include.push("charity");
  }

  console.log({options})
  if(options?.userId){
  include.push({
    model: Like,
    as: "likedByUsers",
    where: {
      userId: options?.userId,
    },
    required: false,
  });
}

  return Dog.findAll({
    order: [["id", "desc"]],
    include,
  })
};

export const create = async (dog: CreateDogInput) => {
  return Dog.create(dog).catch((e) => {
    console.log(e);
    throw e;
  });
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
