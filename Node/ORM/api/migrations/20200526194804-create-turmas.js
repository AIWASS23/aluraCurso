'use strict';
export function up(queryInterface, Sequelize) {
  return queryInterface.createTable('Turmas', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    docente_id: {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: { model: 'Pessoas', key: 'id' }
    },
    data_inicio: {
      type: Sequelize.DATEONLY
    },
    nivel_id: {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: { model: 'Niveis', key: 'id' }
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
  return queryInterface.dropTable('Turmas');
}