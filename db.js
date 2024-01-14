import dotenv from 'dotenv';
dotenv.config();
console.log("Path of loaded .env file:", process.env.PWD);
import pkg from 'pg';
const { Pool } = pkg ;

const poolConfig = {
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
	password: ''
};

console.log(poolConfig.user);

if (process.env.DB_PASSWORD) {
    poolConfig.password = process.env.DB_PASSWORD;
}

const pool = new Pool(poolConfig);

export default pool;
