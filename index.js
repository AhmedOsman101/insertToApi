const axios = require("axios");
const mysql = require("mysql2/promise");
const fs = require("fs");
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

fs.readFile("newData.json", "utf8", (err, data) => {
	if (err) {
		console.error(err);
		return;
	}

	// Parse the JSON data
	const items = JSON.parse(data);
	// console.log(items);
	// Get all the categories
	const brands = items.map((item)=> item.brand);
	console.log(brands);
	const categories = items.map((item) => {
		item = {
			id: item.id,
			title: item.title,
			description: item.description,
			price: item.price,
			discountPercentage: "5",
			rate: "3",
			stock: "197",
			brand: "",
			category: "Miscellaneous",
			images: [
				"https://i.imgur.com/TF0pXdL.jpg",
				"https://i.imgur.com/BLDByXP.jpg",
				"https://i.imgur.com/b7trwCv.jpg",
			],
		};
	});
});

const Categories = {
	Electronics: 1,
	Clothes: 2,
	Furniture: 3,
	Shoes: 4,
	Miscellaneous: 5,
};

// console.log(Categories);
// console.log(Categories["Clothes"]);
async function fetchDataAndStore() {
	try {
		// Fetch data from the API

		// Get a connection from the pool
		const connection = await pool.getConnection();

		// Loop through the products and store them in the database
		for (let product of products) {
			const { title, price, description, images, category } = product;

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
// fetchDataAndStore();
