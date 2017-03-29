'use strict';


module.exports = function (Sequelize, sequelize) {
  return sequelize.define('user', {
    _id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    email: Sequelize.STRING,
    username: Sequelize.STRING,
    password: Sequelize.STRING,
    active: Sequelize.BOOLEAN
  });
}