import {
  Sequelize,
  QueryTypes,
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
  CreationAttributes,
  Op,
} from "sequelize";

export class Charity extends Model<
  InferAttributes<Charity>,
  InferCreationAttributes<Charity>
> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare codes: CreationOptional<string[]>;
}

export type CreateCharityInput = CreationAttributes<Charity>;

export type UpdateCharityInput = CreationAttributes<Charity>;

export const getById = async (id: number) => {
  return Charity.findByPk(id, { include: ["dogs"] });
};

export const getByCode = async (code: string) => {
  return Charity.findOne({
    where: {
      codes: { [Op.contains]: [code] },
    },
  });
};

export const addCodeToCharity = async (id: number, code: string) => {
  const existingCharity = await getByCode(code);
  if (existingCharity) {
    return false;
  }

  await Charity.update(
    {
      codes: Charity.sequelize?.fn(
        "array_append",
        Charity.sequelize.col("codes"),
        code
      ),
    },

    { where: { id } }
  );
  return getById(id);
};
export const deleteCodeFromCharity = async (id: number, code: string) => {
  const existingCharity = await getByCode(code);
  if (!existingCharity) {
    return false;
  }

  await Charity.update(
    {
      codes: Charity.sequelize?.fn(
        "array_remove",
        Charity.sequelize.col("codes"),
        code
      ),
    },
    { where: { id } }
  );
  return getById(id);
}

export const getAll = async () => {
  return Charity.findAll({ order: [["createdAt", "desc"]] });
};

export const create = async (charity: CreateCharityInput) => {
  return Charity.create(charity);
};

export const update = async (id: number, charity: UpdateCharityInput) => {
  const existingCharity = await getById(id);
  if (!existingCharity) {
    return null;
  }

  await Charity.update(charity, {
    where: {
      id: id,
    },
  });

  return getById(id);
};

export const remove = async (id: number): Promise<boolean> => {
  const existingCharity = await getById(id);
  if (!existingCharity) {
    return false;
  }

  await existingCharity.destroy();
  return true;
};
