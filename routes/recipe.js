// import express framework
import express from "express";
// import mongodb objectid for querying by id
import { ObjectId } from "mongodb";
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

// define a route to handle get requests for a single recipe by id
router.get("/:id", async (req, res) => {
  try {
    // extract id from request parameters
    const recipe_id = req.params.id;
    // connect to the database
    const db = await connect_db();
    // access the recipes collection from the database
    const recipes_collection = db.collection("recipes");
    // find the recipe by its objectid
    const recipe = await recipes_collection.findOne({
      _id: new ObjectId(recipe_id),
    });

    // if no recipe if found, return 404
    if (!recipe) {
      return res.status(404).json({ message: "recipe not found" });
    }

    // return the found recipe
    res.json(recipe);
  } catch (error) {
    // log any errors
    console.error("error fetching recipe:", error);
    // send 500 internal server error
    res.status(500).json({ message: "internal server error" });
  }
});

// define a route to handle post request for adding a new recipe
router.post("/", async (req, res) => {
  // destructure required fields from the request body
  const {
    title,
    subtitle,
    author_name,
    description,
    category,
    prep_time,
    cook_time,
    total_time,
    servings,
    ingredients,
    instructions,
  } = req.body;

  // check if any required field is missing
  if (
    !title ||
    !subtitle ||
    !author_name ||
    !description ||
    !category ||
    !prep_time ||
    !cook_time ||
    !total_time ||
    !servings ||
    !ingredients ||
    !instructions
  ) {
    // respond with a 400 bad request if any field is missing
    return res.status(400).json({ message: "missing required fields" });
  }

  try {
    // connect to the database
    const db = await connect_db();
    // get the recipes collection from the database
    const recipes_collection = db.collection("recipes");

    // helper function to get the current date in yyyy-mm-dd format
    function get_current_datetime() {
      const now = new Date();

      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    }

    // create a new recipe object with default images and submitted data
    const new_recipe = {
      recipe_image:
        "https://res.cloudinary.com/de74jeqj6/image/upload/v1751548245/DEFAULT_RECIPE_IMAGE_y9dmeh.png",
      ingredients_image:
        "https://res.cloudinary.com/de74jeqj6/image/upload/v1751548255/DEFAULT_INGREDIENTS_IMAGE_ifblqh.png",
      title: title,
      subtitle: subtitle,
      author_name: author_name,
      description: description,
      category: category,
      prep_time: prep_time,
      cook_time: cook_time,
      total_time: total_time,
      servings: servings,
      ingredients: ingredients,
      instructions: instructions,
      created_at: get_current_datetime(),
    };

    // insert the new recipe into the database
    await recipes_collection.insertOne(new_recipe);
    // respond with success message
    res.status(201).json({ message: "recipe added" });
  } catch (error) {
    // log the error and respond with a 500 internal server error
    console.error("error adding recipe", error);
    res.status(500).json({ message: "internal server error" });
  }
});

// export the router to be used in other parts of the application
export default router;
