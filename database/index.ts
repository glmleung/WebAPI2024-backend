import {
  Sequelize,
  QueryTypes,
  DataTypes,
  Model,
  InferAttributes,
  InferCreationAttributes,
  CreationOptional,
} from "sequelize";
import { config } from "./config";
import { Dog } from "../models/dogs";
import { User } from "../models/users";

const sequelize = new Sequelize(
  `postgres://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`,
  { dialect: "postgres" }
);


Dog.init(
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
      type: DataTypes.FLOAT,
    },
    breed: {
      type: DataTypes.STRING,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "dogs",
    sequelize,
  }
);



User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    role:{
      type: DataTypes.STRING,

    },
  updatedAt: {
    type: DataTypes.DATE,
  },
  },
  {
    tableName: "users",
    sequelize,
  }
);

export { sequelize   };
