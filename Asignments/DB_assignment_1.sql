-- create table books
CREATE TABLE Books (
    book_id INT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    publication_year INT
);

-- create table library members
CREATE TABLE LibraryMembers (
    member_id INT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    joined_date DATE,
    book_id INT,
    FOREIGN KEY (book_id) REFERENCES Books(book_id) ON DELETE SET NULL ON UPDATE CASCADE
);

-- insert records in the books table
INSERT INTO Books (book_id, title, author, publication_year) VALUES
(1, 'The Great Gatsby', 'F. Scott Fitzgerald', 1925),
(2, 'To Kill a Mockingbird', 'Harper Lee', 1960),
(3, '1984', 'George Orwell', 1949),
(4, 'Pride and Prejudice', 'Jane Austen', 1813),
(5, 'The Catcher in the Rye', 'J.D. Salinger', 1951);

-- insert records in the library members table
INSERT INTO LibraryMembers (member_id, name, email, joined_date, book_id) VALUES
(1, 'Alice Smith', 'alice@example.com', '2023-01-15', 1),
(2, 'Bob Johnson', 'bob@example.com', '2023-02-20', 3),
(3, 'Charlie Brown', 'charlie@example.com', '2023-03-10', NULL),
(4, 'Diana Prince', 'diana@example.com', '2023-04-05', 2);

-- Write an SQL query to update the borrowed book for the member with member_id = 1
UPDATE LibraryMembers SET book_id = 5 WHERE member_id = 1;

-- Write an SQL query to delete the book with book_id = 2
DELETE FROM Books WHERE book_id = 2;

-- Write an SQL query to delete all members who have not borrowed any books from the library
DELETE FROM LibraryMembers
WHERE book_id IS NULL;

-- Write an SQL query to alter the Members table and add a new column phone_number to store the member's contact number.
ALTER TABLE LibraryMembers
ADD COLUMN phone_number VARCHAR(20);

-- Write an SQL query to select all books that were published before 1950.

SELECT book_id, title, author, publication_year
FROM Books
WHERE publication_year < 1950;

-- Write an SQL query to find out how many members have borrowed books from the library.
SELECT COUNT(member_id) AS NumberOfBorrowers
FROM LibraryMembers
WHERE book_id IS NOT NULL;

-- Write an SQL query to list all the books that have not been borrowed by any member.

SELECT b.book_id, b.title, b.author, b.publication_year
FROM Books b
LEFT JOIN LibraryMembers lm ON b.book_id = lm.book_id
WHERE lm.member_id IS NULL;

-- Write an SQL query to drop the Members table.
DROP TABLE LibraryMembers;