import knex from 'knex';
import 'dotenv/config';

const DATABASE_USER = process.env.DATABASE_USER;
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;
const DATABASE_TABLE = process.env.DATABASE_TABLE;

const conexao = knex({
    client:  'pg',
    connection: {
        host: 'localhost',
        user: DATABASE_USER,
        password: DATABASE_PASSWORD,
        database: DATABASE_TABLE
    }
});

export default conexao;