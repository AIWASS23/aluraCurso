'use strict';
export function up(queryInterface, Sequelize) {
  return queryInterface.createTable('Matriculas', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    estudante_id: {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: { model: 'Pessoas', key: 'id' }
    },
    status: {
      type: Sequelize.STRING
    },
    turma_id: {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: { model: 'Turmas', key: 'id' }
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE
    }
  });
}
export function down(queryInterface, Sequelize) {
  return queryInterface.dropTable('Matriculas');
}