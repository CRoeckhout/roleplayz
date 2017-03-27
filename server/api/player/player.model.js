'use strict';


module.exports = function (Sequelize, sequelize) {
  return sequelize.define('player', {
    _id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: Sequelize.STRING,
    reference: Sequelize.STRING,
    image: Sequelize.STRING,
    info: Sequelize.STRING,
    active: Sequelize.BOOLEAN
  });
}