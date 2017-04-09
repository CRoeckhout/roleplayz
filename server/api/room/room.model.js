'use strict';

module.exports = function (Sequelize, sequelize) {
  return sequelize.define('rooms', {
    _id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: Sequelize.STRING,
    maxPlayers: Sequelize.INTEGER,
    info: Sequelize.STRING,
    active: Sequelize.BOOLEAN
  })
}