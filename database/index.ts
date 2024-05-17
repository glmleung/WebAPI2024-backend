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
import { Charity } from "../models/charities";
import { Dog } from "../models/dogs";
import { User } from "../models/users";
import { Like } from "../models/likes";

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
    allowNull:false
    },
    charityId:{
      type:DataTypes.INTEGER,
      allowNull:false
    },
    name: {
      type: DataTypes.STRING,
    allowNull:false
  },
    age: {
      type: DataTypes.FLOAT,
    allowNull:false
  },
    breed: {
      type: DataTypes.STRING,
    allowNull:false
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
    allowNull:false

    },
    charityId:{
      type:DataTypes.INTEGER,
      allowNull:true
    },
    username: {
      type: DataTypes.STRING,
    allowNull:false
  },
    password: {
      type: DataTypes.STRING,
    allowNull:false
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

Charity.init( {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull:false
  },
  createdAt: {
    type: DataTypes.DATE,
  },
  updatedAt: {
    type: DataTypes.DATE,
  },
  codes: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue:[]
  },
}, {
  sequelize,
tableName: "charities",
})

Like.init(
  {
    userId:{
      type:DataTypes.INTEGER,
      allowNull:false,
      primaryKey:true
    },
    dogId: {
      type: DataTypes.INTEGER,
    allowNull:false,primaryKey:true
  },
    createdAt: {
      type: DataTypes.DATE,
    },
    updatedAt: {
      type: DataTypes.DATE,
    },
  },
  {
    tableName: "likes",
    sequelize,
  }
);

Dog.belongsTo(Charity,{
  targetKey:"id",
  foreignKey:"charityId",
  as:"charity"
})
Charity.hasMany(Dog,{
  sourceKey:"id",
  foreignKey:"charityId",
  as:"dogs"
})
User.belongsTo(Charity,{
  targetKey:"id",
  foreignKey:"charityId",
  as:"charity"
})
Charity.hasMany(User,{
  sourceKey:"id",
  foreignKey:"charityId",
  as:"workers"
})
Like.belongsTo(User,{
  targetKey:"id",
  foreignKey:"userId",
  as:"user"
})

User.hasMany(Like,{
  sourceKey:"id",
  foreignKey:"userId",
  as:"likedDogs"
})

Like.belongsTo(Dog,{
  targetKey:"id",
  foreignKey:"dogId",
  as:"dog"
})

Dog.hasMany(Like,{
  sourceKey:"id",
  foreignKey:"dogId",
  as:"likedByUsers"
})

export { sequelize   };
