const { DataTypes } = require('sequelize')

const db = require('../database/db')
const User = require('./User')


const Tought = db.define('tought', {
  tought: {
    type: DataTypes.STRING,
    allowNull: false,
    required: true,
  },
})
Tought.belongsTo(User)
User.hasMany(Tought)


module.exports = Tought