DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
	item_id INT AUTO_INCREMENT NOT NULL,
	product_name VARCHAR(20) NOT NULL,
	department_name VARCHAR(20) NULL,
	price DECIMAL(10,2) NOT NULL,
	stock_quantity INTEGER NOT NULL,
    PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Xbox", "Technology", 299.99, 20), ("Playstation", "Technology", 249.99, 20), ("iPhone X", "Technology", 1299.99, 20), ("Toothbrush", "Home Goods", 2.99, 200), ("Shower Curtain", "Home Goods", 12.99, 50), ("Sporks", "Home Goods", 2.99, 150), ("Monopoly", "Games", 10.99, 40), ("Scrabble", "Games", 8.99, 45), ("Jenga", "Games", 14.99, 40), ("Tee Shirt", "Clothing", 9.99, 100);