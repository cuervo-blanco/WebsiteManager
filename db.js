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

async function getGalleryContent(userId) {
		try{
			const query = 'SELECT connection_id, src, alt, link, section_id, title, description, subtitle FROM contents WHERE user_id = $1 ORDER BY connection_id';
			const value = [userId];
			const result = await pool.query(query, value);
			return result.rows;
		} catch(err) {
			console.error('Error getting initial content for gallery', err.stack);
			throw err;
		}

}

async function saveChangesGallery(userId, data) {
		try{

			const actions = data.map( async (item) => {
				
	const query = 'UPDATE contents SET src = $1, alt = $2, link = $3, section_id = $4, title = $5, description = $6, subtitle = $7 WHERE user_id = $8 AND connection_id = $9' ;
				const values = [item.src, item.alt, item.link, item.section_id, item.title, item.description, item.subtitle, userId, item.connection_id];
				const result = await pool.query(query, values);
				return result;
			});

			const results = await Promise.all(actions);
			return results;

		} catch(err){
			console.error('Error saving changes', err.stack);
			throw err;
		}
}



// Function to get components for a page
async function getPageComponents(pageId) {
  // Database query to get components
}



export { getUserPages, getGalleryContent, saveChangesGallery};
export default pool;

