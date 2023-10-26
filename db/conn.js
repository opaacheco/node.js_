const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("nodetoughts", "root", "arms12345#", {
  host: "127.0.0.1",
  dialect: "mysql",
});

try {
  sequelize.authenticate();
  console.log("senhor, está tudo autenticado e pronto");
} catch (error) {
  console.log(error);
}

module.exports = sequelize;
