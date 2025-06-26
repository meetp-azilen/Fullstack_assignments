
-- Create departments Table Definition
CREATE TABLE departments (
    department_id SERIAL PRIMARY KEY,
    dept_name VARCHAR(100) NOT NULL UNIQUE
);

-- Create employees Table Definition
CREATE TABLE employees (
    emp_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INT CHECK (age >= 18),
    salary NUMERIC(10,2),
    is_active BOOLEAN DEFAULT TRUE,
    join_date DATE DEFAULT CURRENT_DATE,
    skills TEXT[],
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES departments(department_id)
);

-- Create sales Table Definition
CREATE TABLE sales (
    id SERIAL PRIMARY KEY,
    product VARCHAR(100),
    quantity INT,
    price NUMERIC(10,2)
);

-- Insert Sample Data

-- Insert data into departments
INSERT INTO departments (dept_name) VALUES
('Sales'),
('Engineering'),
('HR'),
('Marketing');

-- Insert data into employees
INSERT INTO employees (name, age, salary, is_active, join_date, skills, department_id) VALUES
('Alice Smith', 30, 60000.00, TRUE, '2019-05-10', '{"SQL", "Python", "Communication"}', 1),
('Bob Johnson', 25, 55000.00, TRUE, '2021-01-15', '{"Java", "React", "Testing"}', 2),
('Charlie Brown', 35, 70000.00, FALSE, '2018-08-01', '{"Recruitment", "Onboarding"}', 3),
('David Lee', 22, 50000.00, TRUE, '2022-03-20', '{"SQL", "Marketing Strategy"}', 4),
('Eve Davis', 28, 62000.00, TRUE, '2020-11-11', '{"Python", "Data Analysis"}', 2),
('Frank Green', 40, 80000.00, TRUE, '2017-06-25', '{"Leadership", "Sales"}', 1),
('Grace White', 21, 48000.00, TRUE, '2023-02-01', '{"Social Media", "Content Creation"}', 4),
('Heidi Black', 29, 0.00, TRUE, '2023-03-15', '{"Intern"}', 3); -- Example with 0 salary

-- Insert data into sales
INSERT INTO sales (product, quantity, price) VALUES
('Laptop', 5, 1200.50),
('Keyboard', 20, 75.00),
('Mouse', 30, 25.50),
('Monitor', 8, 300.00),
('Webcam', 15, 50.00),
('Phone', 10, 800.75),
('Tablet', 12, 450.00);

-- Write SQL Queries

-- Select all employee names and salaries
SELECT name, salary FROM employees;

-- List employees with age greater than 25
SELECT * FROM employees WHERE age > 25;

-- Display only the first 2 employees
SELECT * FROM employees LIMIT 2;

-- Sort employees by salary in descending order
SELECT * FROM employees ORDER BY salary DESC;

-- Total salary expense
SELECT SUM(salary) AS total_salary_expense FROM employees;

-- Count number of employees
SELECT COUNT(*) AS total_employees FROM employees;

-- Average product price
SELECT AVG(price) AS average_product_price FROM sales;

-- Highest quantity sold
SELECT MAX(quantity) AS highest_quantity_sold FROM sales;

-- Show first 3 letters of each product
SELECT LEFT(product, 3) AS product_prefix FROM sales;

-- Concatenate product name and price
SELECT product || ' - $' || price AS product_with_price FROM sales;
-- Or using CONCAT:
-- SELECT CONCAT(product, ' - $', price) AS product_with_price FROM sales;

-- Replace 'Phone' with 'Smartphone'
SELECT product, REPLACE(product, 'Phone', 'Smartphone') AS updated_product_name FROM sales;

-- Round prices to nearest integer
SELECT product, ROUND(price) AS rounded_price FROM sales;

-- Show today’s date
SELECT CURRENT_DATE AS today;

-- Extract year and month from join date
SELECT name, EXTRACT(YEAR FROM join_date) AS join_year, EXTRACT(MONTH FROM join_date) AS join_month FROM employees;

-- Add 10 days to join date
SELECT name, join_date, join_date + INTERVAL '10 days' AS join_date_plus_10_days FROM employees;

-- Categorize products by price, If price is > 500 then 'Expensive' otherwise 'Affordable':
SELECT
    product,
    price,
    CASE
        WHEN price > 500 THEN 'Expensive'
        ELSE 'Affordable'
    END AS price_category
FROM sales;

-- Show NULL if salary is 0
SELECT name, NULLIF(salary, 0.00) AS salary_or_null FROM employees;

-- Cast price to text
SELECT product, CAST(price AS TEXT) AS price_as_text FROM sales;

-- Find the highest salary among employees
SELECT MAX(salary) AS highest_salary FROM employees;

-- Get the average salary of employees
SELECT AVG(salary) AS average_salary FROM employees;

-- Find employees who have joined after January 1, 2020
SELECT * FROM employees WHERE join_date > '2020-01-01';

-- Find employees who are currently active
SELECT * FROM employees WHERE is_active;

