'use strict';
import { DataTypes } from 'sequelize'; 

const Matriculas = (sequelize, DataTypes) => {
  const Matriculas = sequelize.define('Matriculas', {
    status: DataTypes.STRING
  }, {});

  Matriculas.associate = function(models) {
    Matriculas.belongsTo(models.Pessoas, {
      foreignKey: 'estudante_id'
    });
    Matriculas.belongsTo(models.Turmas, {
      foreignKey: 'turma_id'
    });
  };

  return Matriculas;
};

export default Matriculas; // Exporte o objeto Matriculas
