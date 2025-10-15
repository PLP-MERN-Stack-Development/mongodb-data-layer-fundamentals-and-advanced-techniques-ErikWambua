// queries.js - MongoDB queries for PLP Bookstore Assignment

// Connect to the database
use ('plp_bookstore');

print("=== PLP BOOKSTORE MONGODB QUERIES ===");

// ===== TASK 2: BASIC CRUD OPERATIONS =====

print("\n--- TASK 2: BASIC CRUD OPERATIONS ---");

// 1. Find all books in a specific genre
print("\n1. All Fiction books:");
db.books.find({ genre: "Fiction" }).forEach(printjson);

// 2. Find books published after a certain year
print("\n2. Books published after 1950:");
db.books.find({ published_year: { $gt: 1950 } }).forEach(printjson);

// 3. Find books by a specific author
print("\n3. Books by George Orwell:");
db.books.find({ author: "George Orwell" }).forEach(printjson);

// 4. Update the price of a specific book
print("\n4. Updating price of 'The Great Gatsby' to $14.99:");
db.books.updateOne(
  { title: "The Great Gatsby" },
  { $set: { price: 14.99 } }
);
print("Update completed - checking updated book:");
db.books.find({ title: "The Great Gatsby" }).forEach(printjson);

// 5. Delete a book by its title
print("\n5. Deleting 'The Alchemist':");
db.books.deleteOne({ title: "The Alchemist" });
print("Delete operation completed");
print("Remaining books count:", db.books.countDocuments());

// ===== TASK 3: ADVANCED QUERIES =====

print("\n--- TASK 3: ADVANCED QUERIES ---");

// 1. Find books that are both in stock and published after 2010
print("\n1. In-stock books published after 2010:");
db.books.find({
  in_stock: true,
  published_year: { $gt: 2010 }
}).forEach(printjson);

// 2. Use projection to return only title, author, and price
print("\n2. Books with projection (title, author, price only):");
db.books.find(
  {},
  { title: 1, author: 1, price: 1, _id: 0 }
).forEach(printjson);

// 3. Implement sorting by price (ascending and descending)
print("\n3a. Books sorted by price (ascending):");
db.books.find()
  .sort({ price: 1 })
  .forEach(printjson);

print("\n3b. Books sorted by price (descending):");
db.books.find()
  .sort({ price: -1 })
  .forEach(printjson);

// 4. Implement pagination (5 books per page)
print("\n4. PAGINATION DEMONSTRATION:");

print("\nPage 1 (books 1-5):");
db.books.find()
  .sort({ title: 1 })
  .limit(5)
  .skip(0)
  .forEach(printjson);

print("\nPage 2 (books 6-10):");
db.books.find()
  .sort({ title: 1 })
  .limit(5)
  .skip(5)
  .forEach(printjson);

print("\nPage 3 (books 11+):");
db.books.find()
  .sort({ title: 1 })
  .limit(5)
  .skip(10)
  .forEach(printjson);

// ===== TASK 4: AGGREGATION PIPELINE =====

print("\n--- TASK 4: AGGREGATION PIPELINES ---");

// 1. Calculate average price of books by genre
print("\n1. Average price by genre:");
db.books.aggregate([
  {
    $group: {
      _id: "$genre",
      averagePrice: { $avg: "$price" },
      totalBooks: { $sum: 1 }
    }
  },
  {
    $sort: { averagePrice: -1 }
  },
  {
    $project: {
      genre: "$_id",
      averagePrice: { $round: ["$averagePrice", 2] },
      totalBooks: 1,
      _id: 0
    }
  }
]).forEach(printjson);

// 2. Find author with the most books in the collection
print("\n2. Author with most books:");
db.books.aggregate([
  {
    $group: {
      _id: "$author",
      bookCount: { $sum: 1 }
    }
  },
  {
    $sort: { bookCount: -1 }
  },
  {
    $limit: 3
  },
  {
    $project: {
      author: "$_id",
      bookCount: 1,
      _id: 0
    }
  }
]).forEach(printjson);

// 3. Group books by publication decade and count them
print("\n3. Books count by publication decade:");
db.books.aggregate([
  {
    $project: {
      title: 1,
      published_year: 1,
      decade: {
        $concat: [
          { $toString: { $subtract: ["$published_year", { $mod: ["$published_year", 10] }] } },
          "s"
        ]
      }
    }
  },
  {
    $group: {
      _id: "$decade",
      bookCount: { $sum: 1 },
      books: { $push: "$title" }
    }
  },
  {
    $sort: { _id: 1 }
  },
  {
    $project: {
      decade: "$_id",
      bookCount: 1,
      sampleBooks: { $slice: ["$books", 3] },
      _id: 0
    }
  }
]).forEach(printjson);

// ===== TASK 5: INDEXING =====

print("\n--- TASK 5: INDEXING AND PERFORMANCE ---");

// 1. Create index on title field
print("\n1. Creating index on title field...");
db.books.createIndex({ title: 1 });
print("Index created on title field");

// 2. Create compound index on author and published_year
print("\n2. Creating compound index on author and published_year...");
db.books.createIndex({ author: 1, published_year: -1 });
print("Compound index created on author and published_year");

// 3. Create additional useful indexes
print("\n3. Creating additional indexes...");
db.books.createIndex({ genre: 1 });
db.books.createIndex({ in_stock: 1 });
db.books.createIndex({ published_year: -1 });
print("Additional indexes created");

// 4. Display all indexes
print("\n4. Current indexes on books collection:");
db.books.getIndexes().forEach(printjson);

// 5. Demonstrate performance improvement with explain()
print("\n5. PERFORMANCE COMPARISON WITH explain():");

print("\n5a. Query without specific index (genre search):");
const genreQueryStats = db.books.find({ genre: "Fantasy" }).explain("executionStats");
print("Execution time:", genreQueryStats.executionStats.executionTimeMillis, "ms");
print("Documents examined:", genreQueryStats.executionStats.totalDocsExamined);
print("Index used:", genreQueryStats.executionStats.executionStages.inputStage?.indexName || "COLLSCAN");

print("\n5b. Query with title index:");
const titleQueryStats = db.books.find({ title: "1984" }).explain("executionStats");
print("Execution time:", titleQueryStats.executionStats.executionTimeMillis, "ms");
print("Documents examined:", titleQueryStats.executionStats.totalDocsExamined);
print("Index used:", titleQueryStats.executionStats.executionStages.inputStage?.indexName || "COLLSCAN");

print("\n5c. Query with compound index (author + published_year):");
const compoundQueryStats = db.books.find({ 
  author: "George Orwell", 
  published_year: { $gt: 1940 } 
}).explain("executionStats");
print("Execution time:", compoundQueryStats.executionStats.executionTimeMillis, "ms");
print("Documents examined:", compoundQueryStats.executionStats.totalDocsExamined);
print("Index used:", compoundQueryStats.executionStats.executionStages.inputStage?.indexName || "COLLSCAN");

// ===== ADDITIONAL USEFUL QUERIES =====

print("\n--- ADDITIONAL ANALYSIS QUERIES ---");

// Find most expensive book
print("\n1. Most expensive book:");
db.books.find()
  .sort({ price: -1 })
  .limit(1)
  .forEach(printjson);

// Find cheapest book
print("\n2. Cheapest book:");
db.books.find()
  .sort({ price: 1 })
  .limit(1)
  .forEach(printjson);

// Books with highest page count
print("\n3. Longest books (by page count):");
db.books.find()
  .sort({ pages: -1 })
  .limit(3)
  .forEach(printjson);

// Out of stock books
print("\n4. Out of stock books:");
db.books.find({ in_stock: false })
  .forEach(printjson);

// Books by publication year range
print("\n5. Books from 20th century (1900-1999):");
db.books.find({
  published_year: { $gte: 1900, $lte: 1999 }
}).forEach(printjson);

print("\n=== ALL QUERIES COMPLETED SUCCESSFULLY ===");
print("Total books in collection:", db.books.countDocuments());