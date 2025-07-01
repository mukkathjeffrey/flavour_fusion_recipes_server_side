// import express framework
import express from "express";
// import database connection function
import connect_db from "../db/db.js";

// create a new router instance
const router = express.Router();

// define a route to handle get requests to the root path
router.get("/", async (req, res) => {
  try {
    // connect to the database
    const db = await connect_db();
    // access the recipes collection from the database
    const recipes_collection = db.collection("recipes");
    // fetch all documents from the recipes collection and convert to array
    const recipes = await recipes_collection.find({}).toArray();
    // send the retrieved recipes as a json response
    res.json(recipes);
  } catch (error) {
    // log any errors that occur during the process
    console.error("error fetching recipes:", error);
    // send a 500 internal server error response
    res.status(500).json({ message: "internal server error" });
  }
});

// export the router to be used in other parts of the application
export default router;
