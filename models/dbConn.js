const dbConfig = require("../configs/dbConfig");
const Sequelize = require("sequelize");

const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.user,
    dbConfig.password,
    {
        host: dbConfig.host,
        dialect: dbConfig.dialect
    }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.hospital = require("./hospital.model")(sequelize,Sequelize);
db.waste = require("./waste.model")(sequelize,Sequelize);
db.user = require("./user.model")(sequelize,Sequelize);


module.exports = db;

