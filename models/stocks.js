'use strict';
module.exports = (sequelize, DataTypes) => {
  const Stocks = sequelize.define('Stocks', {
    ticker: DataTypes.STRING,
    time: DataTypes.DATE,
    open: DataTypes.FLOAT,
    high: DataTypes.FLOAT,
    low: DataTypes.FLOAT,
    close: DataTypes.FLOAT,
    volume: DataTypes.FLOAT
  }, {});
  Stocks.associate = function(models) {
    // associations can be defined here
  };
  return Stocks;
};