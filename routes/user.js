// import express framework
import express from "express";
// import bcrypt for password hashing and comparison
import bcrypt from "bcrypt";
// import the database connection function
import connect_db from "../db/db.js";

// create a new express router
const router = express.Router();

// user registration route
router.post("/register", async (req, res) => {
  // extract fields from request body
  const { firstname, lastname, email, password } = req.body;

  // check if all fields are provided
  if (!firstname || !lastname || !email || !password) {
    return res.status(400).json({ message: "all fields are required" });
  }

  // validate first name (only letters and spaces allowed)
  const firstname_regex = /^[a-z\s]+$/i;
  if (!firstname_regex.test(firstname)) {
    return res
      .status(400)
      .json({ message: "first name must contain only letters and spaces" });
  }

  // validate last name (only letters and spaces allowed)
  const lastname_regex = /^[a-z\s]+$/i;
  if (!lastname_regex.test(lastname)) {
    return res
      .status(400)
      .json({ message: "last name must contain only letters and spaces" });
  }

  // validate email format
  const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email_regex.test(email)) {
    return res.status(400).json({ message: "invalid email format" });
  }

  // validate password strength
  const password_regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  if (!password_regex.test(password)) {
    return res.status(400).json({
      message:
        "password must be atleast 8 characters long and include uppercase, lowercase, number, and special character",
    });
  }

  try {
    // connect to the database
    const db = await connect_db();
    const user_collection = db.collection("users");

    // check if email is already registered
    const existing_user = await user_collection.findOne({ email });
    if (existing_user) {
      return res.status(409).json({ message: "email already registered" });
    }

    // hash the password
    const hashed_password = await bcrypt.hash(password, 10);

    // helper function to get the current date and time in yyyy_mm_dd hh:mm:ss format
    function get_current_datetime() {
      const now = new Date();

      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");

      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");

      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }

    // create new user object
    const new_user = {
      profile_picture:
        "https://res.cloudinary.com/de74jeqj6/image/upload/v1750413153/DEFAULT_PROFILE_PICTURE_zuuai4.png",
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: hashed_password,
      admin: false,
      created_at: get_current_datetime(),
    };

    // insert the new user into the collection
    await user_collection.insertOne(new_user);
    // respond wtih success
    res.status(201).json({ message: "registration successful" });
  } catch (error) {
    // handle any errors during the process
    console.error("registration error:", error);
    res.status(500).json({ message: "internal server error" });
  }
});

// user login route
router.post("/login", async (req, res) => {
  // extract email and password from request body
  const { email, password } = req.body;

  // check if both fields are present
  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }

  try {
    // connect to the database
    const db = await connect_db();
    const user_collection = db.collection("users");

    // find the user by email
    const user = await user_collection.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "invalid credentials" });
    }

    // compare the provided password with the stored hashed password
    const password_match = await bcrypt.compare(password, user.password);
    if (!password_match) {
      return res.status(401).json({ message: "invalid credentials" });
    }

    // respond with login success and basic user info
    res.status(200).json({
      message: "login successful",
      user: {
        first_name: user.firstname,
        last_name: user.last_name,
        email: user.email,
      },
    });
  } catch (error) {
    // handle any errors during login
    console.error("login error:", error);
    res.status(500).json({ message: "internal server error" });
  }
});

// export the router to use in main app
export default router;
