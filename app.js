const express = require('express');
const faker = require('faker');
const app = express();
const fs = require('fs');
const csvWriter = require('fast-csv');

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; // The maximum is inclusive and the minimum is inclusive
  }
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  let people = [];
  let books = []
  for (let j =0; j<100; j++){
    let bookTitle = faker.random.words(3);
    let bookPrice = faker.finance.amount();
    if(bookPrice>100){
        bookPrice=bookPrice/10;
    }
    books.push({
        ID: j,
        Title: bookTitle,
        Price: bookPrice,
        });
    }
  for (let i = 0; i < 100000; i++) {
    let personID = i;
    let firstName = faker.name.firstName();
    let lastName = faker.name.lastName();
    let middleInitial = faker.random.alpha({ count: 1, upcase: true });
    let birthDate = faker.date.past(50, '2000-01-01').toLocaleDateString('en-US');
    let last4SSN = faker.finance.account(4);
    let totalSales = faker.finance.amount();
    let gender = faker.random.arrayElement(['Male', 'Female']);
    let largestPurchase = faker.finance.amount();
    let favoriteBookID = getRandomInt(0,99);
    people.push({
        'PersonID':personID,
      Name: `${lastName}, ${firstName} ${middleInitial}`,
      Birthdate: birthDate,
      'Last 4 SSN': last4SSN,
      'Total Sales': totalSales,
      Gender: gender,
      'Largest Purchase': largestPurchase,
      'Favorite Book ID': favoriteBookID,
    });
  }
  const ws = fs.createWriteStream('./data/people.csv');
  csvWriter.write(people, { headers: true }).pipe(ws);

  const wb = fs.createWriteStream('./data/books.csv');
  csvWriter.write(books, { headers: true }).pipe(wb);


  res.render('index', { people: people });
});

app.listen(3000, () => console.log('App is listening on port 3000'));