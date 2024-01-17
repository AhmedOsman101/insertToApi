const axios = require("axios");
const mysql = require("mysql2/promise");
const fs = require("fs");
const util = require("util");
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

// Read the JSON file

const readFile = util.promisify(fs.readFile);

async function readAndStoreItems() {
	try {
		// Read the file and parse JSON data
		const data = await readFile("newData.json", "utf8");
		const items = JSON.parse(data);
		fetchDataAndStore(items);
	} catch (err) {
		// Handle error
		console.error("Error reading file:", err);
	}
}

readAndStoreItems();
// console.log(readAndStoreItems());
// console.log(Object.keys(readAndStoreItems()));

// console.log(Categories); console.log(Categories["Clothes"]);
async function fetchDataAndStore(data) {
	try {
		const Categories = {
			Electronics: 1,
			Clothes: 2,
			Furniture: 3,
			Shoes: 4,
			Miscellaneous: 5,
		};
		// Get a connection from the pool
		const connection = await pool.getConnection();

		// Loop through the products and store them in the database
		for (let product of data) {
			const {
				id,
				title,
				price,
				category,
				description,
				discountPercentage,
				rate,
				stock,
				images,
			} = product;
			// Insert the product into the database
			await connection.query(
				`INSERT INTO products (id, name, price, category_id,
					description, image_path, discount, rating, stock) VALUES
					(?, ?, ?, ?, ?, ?, ?, ?, ?)`,
				[
					+id+1,
					title,
					price,
					Categories[category],
					description,
					JSON.stringify(images),
					discountPercentage,
					rate,
					stock,
				]
			);
		}

		// Release the connection back to the pool
		connection.release();
		console.log("success");
		// console.log(data);
	} catch (error) {
		console.error(`Error: ${error}`);
	}
}
