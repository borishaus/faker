// Import the required modules
const express = require('express');
const faker = require('faker');
const app = express();
const fs = require('fs');
const csvWriter = require('fast-csv');

// Define a function to generate a random integer within a given range
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Set the template engine to EJS
app.set('view engine', 'ejs');

// Define the handler for the root path
app.get('/', (req, res) => {
  let people = [];
  let books = [];

  // Generate data for 100 books
  for (let j = 0; j < 100; j++){
    let bookTitle = faker.random.words(3);
    let bookPrice = faker.finance.amount();

    // Ensure the book price is not too high
    if(bookPrice > 100){
      bookPrice = bookPrice / 10;
    }

    books.push({
      ID: j,
      Title: bookTitle,
      Price: bookPrice,
    });
  }

  // Generate data for 100000 people
  for (let i = 0; i < 1000000; i++) {
    let personID = i;
    let firstName = faker.name.firstName();
    let lastName = faker.name.lastName();
    let middleInitial = faker.random.alpha({ count: 1, upcase: true });
    let birthDate = faker.date.past(50, '2000-01-01').toLocaleDateString('en-US');
    let last4SSN = faker.finance.account(4);
    let totalSales = faker.finance.amount();
    let gender = faker.random.arrayElement(['Male', 'Female']);
    let largestPurchase = faker.finance.amount();
    let favoriteBookID = getRandomInt(0, 99);

    people.push({
      'PersonID': personID,
      Name: `${lastName}, ${firstName} ${middleInitial}`,
      Birthdate: birthDate,
      'Last 4 SSN': last4SSN,
      'Total Sales': totalSales,
      Gender: gender,
      'Largest Purchase': largestPurchase,
      'Favorite Book ID': favoriteBookID,
    });
  }

  // Write the people data to a CSV file
  const ws = fs.createWriteStream('./data/people.csv');
  csvWriter.write(people, { headers: true }).pipe(ws);

  // Write the books data to a CSV file
  const wb = fs.createWriteStream('./data/books.csv');
  csvWriter.write(books, { headers: true }).pipe(wb);

  // Render the index view, passing the people data to it
  res.render('index', { people: people });
});

// Start the server, listening on port 3000
app.listen(3000, () => console.log('App is listening on port 3000'));
