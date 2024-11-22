const express = require('express');
const { resolve } = require('path');
const sqlite3 = require('sqlite3').verbose();
let { open } = require('sqlite');
const cors = require('cors');

const app = express();
const port = 3000;
app.use(cors());

let db;

(async () => {
  db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database,
  });
})();

async function findAllRestaurants() {
  let query = 'Select * from restaurants';
  let response = await db.all(query, []);
  return { restaurants: response };
}

async function findByID(id) {
  let query = 'Select * from restaurants where id= ?';
  let response = await db.all(query, [id]);
  return { restaurants: response };
}

app.get('/restaurants', async (req, res) => {
  let result = await findAllRestaurants();

  res.status(200).json(result);
});

app.get('/restaurants/details/:id', async (req, res) => {
  let id = parseInt(req.params.id);
  let result = await findByID(id);

  res.status(200).json(result);
});

app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
  let cuisine = req.params.cuisine; // Use the correct variable
  let result = await findByCuisine(cuisine);

  res.status(200).json(result);
});

async function findByCuisine(cuisine) {
  let query = 'SELECT * FROM restaurants WHERE cuisine = ?'; // Exact match query
  let response = await db.all(query, [cuisine]);
  return { restaurants: response }; // Wrap response in an object
}

app.get('/restaurants/filter', async (req, res) => {
  let isVeg = req.query.isVeg;
  let hasOutdoorSeating = req.query.hasOutdoorSeating;
  let isLuxury = req.query.isLuxury;
  let result = await findByFilters(isVeg, hasOutdoorSeating, isLuxury);

  res.status(200).json(result);
});

async function findByFilters(isVeg, hasOutdoorSeating, isLuxury) {
  let query =
    'SELECT * FROM restaurants WHERE isVeg = ? and hasOutdoorSeating= ? and  isLuxury=?'; // Exact match query
  let response = await db.all(query, [isVeg, hasOutdoorSeating, isLuxury]);
  return { restaurants: response }; // Wrap response in an object
}

app.get('/restaurants/sort-by-rating', async (req, res) => {
  let result = await findAllRestaurants();
  let sortByRating = result.restaurants.sort((a, b) => b.rating - a.rating);

  res.status(200).json({ restaurants: sortByRating });
});

app.get('/dishes', async (req, res) => {
  let result = await findAllDishes();

  res.status(200).json(result);
});

async function findAllDishes() {
  let query = 'Select * from dishes';
  let response = await db.all(query, []);
  return { dishes: response };
}

app.get('/dishes/details/:id', async (req, res) => {
  let id = parseInt(req.params.id);
  let result = await findDisheByID(id);

  res.status(200).json(result);
});

async function findDisheByID(id) {
  let query = 'Select * from dishes';
  let response = await db.all(query, [id]);
  return { dishes: response };
}

app.get('/dishes/filter', async (req, res) => {
  let isVeg = req.query.isVeg;
  let result = await findByFilter(isVeg);

  res.status(200).json(result);
});

async function findByFilter(isVeg) {
  let query = 'Select * from dishes where isVeg=?';
  let response = await db.all(query, [isVeg]);
  return { dishes: response };
}

app.get('/dishes/sort-by-price', async (req, res) => {
  let result = await findAllDishes();

  let sortLowtoHigh = result.dishes.sort((a, b) => a.price - b.price);

  res.status(200).json({ dishes: sortLowtoHigh });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
