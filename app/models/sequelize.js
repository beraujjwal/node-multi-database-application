const config = require("../config/config.js");
const { Sequelize, DataTypes, Op } = require("sequelize");

const sequelize = new Sequelize(
  config.db.DB_NAME,
  config.db.DB_USER,
  config.db.DB_PASS,
  {
    host: config.db.DB_HOST,
    dialect: config.db.dialect,
    operatorsAliases: false,

    poll: {
      max: config.db.pool.max,
      min: config.db.pool.min,
      acquire: config.db.pool.acquire,
      idle: config.db.pool.idle
    }
  }
);

const mysql = {};

mysql.Sequelize = Sequelize;
mysql.Op = Op;
mysql.sequelize = sequelize;

mysql.books = require("./book.sequelize.js")(sequelize, Sequelize, DataTypes);
mysql.user = require("./user.sequelize.js")(sequelize, Sequelize, DataTypes);
mysql.role = require("./role.sequelize.js")(sequelize, Sequelize, DataTypes);

mysql.role.belongsToMany(mysql.user, {
  through: "user_roles",
  foreignKey: "role_id",
  otherKey: "user_id"
});
mysql.user.belongsToMany(mysql.role, {
  through: "user_roles",
  foreignKey: "user_id",
  otherKey: "role_id"
});

mysql.ROLES = ["user", "admin", "moderator"];

module.exports = mysql;
