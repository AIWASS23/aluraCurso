'use strict';
import { DataTypes } from 'sequelize'; 

const Niveis = (sequelize, DataTypes) => {
  const Niveis = sequelize.define('Niveis', {
    descr_nivel: DataTypes.STRING
  }, {});

  Niveis.associate = function(models) {
    Niveis.hasMany(models.Turmas, {
      foreignKey: 'nivel_id'
    });
  };

  return Niveis;
};

export default Niveis; // Exporta a função que define o modelo 'Niveis'
