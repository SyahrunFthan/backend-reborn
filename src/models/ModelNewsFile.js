import { DataTypes } from "sequelize";
import db from "../configs/Database.js";
import News from "./ModelNews.js"

const NewsFile = db.define(
  "NewsFile",
  {
    uuid: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    img: {
      type: DataTypes.STRING,
    },
    path_img: {
      type: DataTypes.STRING,
    },
    news_id: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);

NewsFile.belongsTo(News, {
  foreignKey: "news_id",
  as: "News",
  onDelete: "cascade",
});

export default NewsFile;
