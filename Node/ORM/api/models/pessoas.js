'use strict';
import { DataTypes } from 'sequelize'; // Certifique-se de importar DataTypes, se necessário

const Pessoas = (sequelize, DataTypes) => {
  const Pessoas = sequelize.define('Pessoas', {
    nome: DataTypes.STRING,
    ativo: DataTypes.BOOLEAN,
    email: DataTypes.STRING,
    role: DataTypes.STRING
  }, {});
  Pessoas.associate = function(models) {
    Pessoas.hasMany(models.Turmas, {
      foreignKey: 'docente_id'
    }); 
    Pessoas.hasMany(models.Matriculas, {
      foreignKey: 'estudante_id'
    });
  };

  return Pessoas;
};

export default Pessoas; // Exporte a função que define o modelo 'Pessoas'
