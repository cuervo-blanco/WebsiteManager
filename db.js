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


// Function to get pages for a user
async function getUserPages(userId) {
  // Database query to get pages
	try {
        const query = 'SELECT pages.page_id, page_type_name, page_title FROM user_page_components JOIN pages ON user_page_components.page_id = pages.page_id JOIN page_types ON pages.page_type = page_types.page_type_id WHERE user_id = $1';
        const values = [userId];
        const result = await pool.query(query, values);
        return result.rows; // rows contain the query results
    } catch (err) {
        console.error('Error executing query', err.stack);
        throw err; // Rethrow the error for further handling
    }
}

// Function to get components for a page
async function getPageComponents(pageId) {
  // Database query to get components
}



export { getUserPages };
export default pool;

