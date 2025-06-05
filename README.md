# flavour_fusion_recipes_server_side

this is the backend server for flavour_fusion_recipes project - a recipe management system that powers the api for browsing, searching, and managing global recipes. it also includes user registration, login, and profile management using jwt-based authentication.

## features

- restful api for recipes and users
- user registration and login
- protected routes for authenticated users
- jwt authentication and role-based access (admin/user)
- mongodb database integration
- recipe creation, update, and deletion (admin only)
- basic error handling and validation
- dotenv configuration for environment variables
- cors-enabled for cross-origin requests

## tech stack

- node.js
- express.js
- mongodb
- bcrypt
- jsonwebtoken
- dotenv
- cors

## getting started

### prerequisites

- node.js and npm installed
- mongodb installed locally or an active mongodb atlas cluster
- git

### installation

1. clone the repository

   ```
   git clone https://github.com/mukkathjeffrey/flavour_fusion_recipes_server_side.git
   cd flavour_fusion_recipes_server_side
   ```

2. install dependencies

   ```
   npm install
   ```

3. create a **.env** file in the root of the folder and add

   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```

4. running the server

   ```
   npm start
   ```

## api documentation

### base url

http://localhost:5000/api

### recipe endpoints

| method | endpoint     | description           | authentication required |
| ------ | ------------ | --------------------- | ----------------------- |
| get    | /recipes     | fetch all recipes     | no                      |
| get    | /recipes/:id | fetch a single recipe | no                      |
| post   | /recipes     | create a new recipe   | yes (admin only)        |
| put    | /recipes/:id | update a recipe       | yes (admin only)        |
| delete | /recipes/:id | delete a recipe       | yes (admin only)        |

### user endpoints

| method | endpoint        | description                 | authentication required |
| ------ | --------------- | --------------------------- | ----------------------- |
| post   | /users/register | register a new user         | no                      |
| post   | /users/login    | login and receive jwt token | no                      |
