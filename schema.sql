DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(50) NULL,
  department_name VARCHAR(50) NULL,
  stock_quantity INTEGER(50) NULL,
  product_price FLOAT(50) NULL,
  PRIMARY KEY (id)
);

SELECT * FROM top5000;