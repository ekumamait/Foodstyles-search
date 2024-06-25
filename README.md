##### TABLE OF CONTENT;

---

- [x] **DESCRIPTION**
- [x] **PROJECT SETUP**
- [x] **AVAILABLE ROUTES**
- [ ] **TESTS**
- [x] **PROJECT DEMO**
- [ ] **TODOS**

---

###### :page_facing_up: DESCRIPTION;

Backend API for the foodstyles search

---

##### PROJECT SETUP

---

1. Clone the Repository
   `https://github.com/ekumamait/foodstyles-search.git`

2. Navigate to the application directory
   `cd foodstyles-search`

3. Setup your user credentials and create a database
   `psql -U your_username`
   `CREATE DATABASE foodstyles`
   `\q`

4. Create a `.env` file in the root of the project use the content of _.env.example_ as a guide
   `cp .env.example .env`

5. Install all dependencies
   `npm install`

6. Run necessary database migrations
   `npm run migration:run`

7. Seed the database to generate the basic dummy data in the database
   `npm run seed:run`

8. Start the application in watch mode
   `npm run start:dev`

---

###### AVAILABLE ROUTES;

| EndPoint | Methods | Functionality                   |
| -------- | ------- | ------------------------------- |
| /search  | GET     | `search for items in our menu ` |

---

###### :microscope: TESTS;

- [ ] Tests for routes

- command to run tests:
  `test:watch`

- command to run tests with coverage:
  `test:cov`

---

###### PROJECT DEMO;

Here is an example link to the api request:
**http://localhost:3000/search?searchTerm=vegan**

---

###### TODOS;

1: Use caching mechanisms to store and quickly retrieve results for frequently searched terms.

2: Enhance Search Flexibility by introducing fuzzy search

3: Implement Pagination to improve performance and user experience for large datasets
