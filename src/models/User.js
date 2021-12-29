const { DataTypes } = require('sequelize')

const db = require('../database/db')


const User = db.define('user', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    required: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    required: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    required: true,
  }
})


module.exports = User