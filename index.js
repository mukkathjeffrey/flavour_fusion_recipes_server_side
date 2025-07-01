// import express framework
import express from "express";
// load environment variables from .env file
import "dotenv/config";
// import the database connection function
import connect_db from "./db/db.js";
// import user_related routes
import user_route from "./routes/user.js";
// import recipe_related routes
import recipe_route from "./routes/recipe.js";

// create an express application
const app = express();
// middleware to parse incoming json requests
app.use(express.json());
// middleware to parse url_encoded data (e.g. form submissions)
app.use(express.urlencoded({ extended: true }));
// define the port to run the server on, from environment or fallback to 5000
const PORT = process.env.PORT || 5000;

// connect to the database
connect_db()
  .then(() => {
    // register user route handlers under /api/users
    app.use("/api/users", user_route);
    // register recipe route handlers under /api/recipes
    app.use("/api/recipes", recipe_route);

    // basic root route for testing server status
    app.get("/", (req, res) => {
      res.send("HELLO, WORLD!");
    });

    // start listening for incoming requests
    app.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    // log error if database connection or server startup fails
    console.error("failed to start server:", error);
  });
