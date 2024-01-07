const axios = require("axios");
const mysql = require("mysql2/promise");
require("dotenv").config();

const DB_HOST = process.env.DB_HOST;
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_NAME = process.env.DB_NAME;

// Create a connection pool (connection)
const pool = mysql.createPool({
	host: DB_HOST,
	user: DB_USER,
	password: DB_PASSWORD,
	database: DB_NAME,
});

async function fetchDataAndStore() {
	try {
		// Fetch data from the API
		const response = await axios.get("https://dummyjson.com/products");
		const products = response.data.products;

		// Get a connection from the pool
		const connection = await pool.getConnection();

		// Loop through the products and store them in the database
		for (let product of products) {
			const {
				title,
				price,
				description,
				images,
				category,
			} = product;

			// Insert the product into the database
			if (category == "laptops") {
				await connection.query(
					"INSERT INTO products (name, price, category_id ,description, image_path) VALUES (?, ?, ?, ?, ?)",
					[title, price, 1, description, images[0]]
				);
			}
		}

		// Release the connection back to the pool
		connection.release();
		console.log(products);
	} catch (error) {
		console.error(`Error: ${error}`);
	}
}
fetchDataAndStore();

