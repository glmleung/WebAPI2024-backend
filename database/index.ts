import { Sequelize, QueryTypes, DataTypes } from "sequelize";
import { config } from "./config";

const db = new Sequelize(
  `postgres://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`,
  { dialect: "postgres" }
);


db.define(
  "dogs",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    age: {
      type: DataTypes.DECIMAL,
    },
    breed: {
      type: DataTypes.STRING,
    },
  },
  {
    createdAt: false,
    updatedAt: false,
  }
);
export { db };
