# 📚 PLP Bookstore MongoDB Project

This project demonstrates **MongoDB fundamentals and advanced data manipulation** using JavaScript.  
It includes scripts to populate a database with sample book data and perform various CRUD, aggregation, and indexing operations.

---

## 🗂️ Project Structure

```
mongodb-data-layer-fundamentals-and-advanced-techniques-ErikWambua/
│
├── insert_books.js          # Inserts sample book data into MongoDB
├── insert_missing_books.js  # Inserts only missing books (no overwrite)
├── queries.js               # Performs CRUD, aggregation, and indexing queries
└── README.md                # Project documentation
```

---

## ⚙️ Prerequisites

Before running the scripts, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or later)
- [MongoDB](https://www.mongodb.com/try/download/community) (running locally or via Atlas)
- Basic familiarity with using a terminal or Git Bash

---

## 🧩 1. Setting Up MongoDB

### 🖥️ Local Setup
1. Start MongoDB on your system (default port `27017`).
2. Open a terminal and check if it’s running:
   ```bash
   mongosh
   ```
3. You should see a MongoDB shell prompt like:
   ```
   test>
   ```

---

## 📘 2. Populating the Database

### Option A — Insert All Books (fresh start)
Run the following command to **populate the database from scratch** (drops existing data first):

```bash
node insert_books.js
```

This script will:
- Connect to the `plp_bookstore` database.
- Drop the `books` collection if it exists.
- Insert 12 sample books.
- Display the inserted records.

### Option B — Insert Only Missing Books
If you’ve already populated the database and just want to **add any missing ones**, use:

```bash
node insert_missing_books.js
```

This script checks for missing titles and inserts only those not already present.

---

## 🔍 3. Running the MongoDB Queries

You can execute the queries in two ways:

### 🧑‍💻 Option A — Directly in Mongo Shell
1. Launch the Mongo shell:
   ```bash
   mongosh
   ```
2. Load the script:
   ```bash
   load("queries.js")
   ```

### 🧑‍💻 Option B — Copy Queries Manually
You can copy sections from `queries.js` and paste them into the MongoDB shell for experimentation.

---

## 🧠 4. What Each Script Does

### 🔹 **`insert_books.js`**
- Connects to MongoDB.
- Inserts a collection of 12 sample books.
- Drops existing data before inserting new data.

### 🔹 **`insert_missing_books.js`**
- Connects to MongoDB.
- Inserts only books not already in the collection (avoids duplicates).
- Reports which books were inserted or skipped.

### 🔹 **`queries.js`**
Contains categorized MongoDB operations:

#### 🧱 **TASK 2: Basic CRUD Operations**
- Find all books in a specific genre.
- Find books published after a given year.
- Find books by a particular author.
- Update a book’s price.
- Delete a book by title.

#### ⚙️ **TASK 3: Advanced Queries**
- Combine filters (e.g., in-stock + published after a year).
- Use projections to return only specific fields.
- Sort results by price.
- Demonstrate pagination using `limit()` and `skip()`.

#### 📊 **TASK 4: Aggregation Pipelines**
- Calculate average book price by genre.
- Identify authors with the most books.
- Group books by publication decade.

#### 🚀 **TASK 5: Indexing and Performance**
- Create single and compound indexes.
- Display current indexes.
- Compare query performance using `explain("executionStats")`.

#### 🔎 **Additional Analysis Queries**
- Find the most and least expensive books.
- List out-of-stock books.
- Filter books by century or page count.

---

## 🧮 5. Example MongoDB Queries

After running `insert_books.js`, you can try these in the Mongo shell:

```js
// Find all books
db.books.find();

// Find books by George Orwell
db.books.find({ author: "George Orwell" });

// Find books published after 1950
db.books.find({ published_year: { $gt: 1950 } });

// Find average price by genre
db.books.aggregate([
  { $group: { _id: "$genre", avgPrice: { $avg: "$price" } } }
]);
```

---

## 📈 6. Example Output

When running `insert_books.js`, you should see output similar to:

```
Connected to MongoDB server
Collection dropped successfully
12 books were successfully inserted into the database

Inserted books:
1. "To Kill a Mockingbird" by Harper Lee (1960)
2. "1984" by George Orwell (1949)
...
Connection closed
```

---