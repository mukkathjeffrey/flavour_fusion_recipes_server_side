import express from "express";
import bcrypt from "bcrypt";
import connect_db from "../db/db.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  if (!firstname || !lastname || !email || !password) {
    return res.status(400).json({ message: "all fields are required" });
  }

  const firstname_regex = /^[a-z\s]+$/i;
  if (!firstname_regex.test(firstname)) {
    return res
      .status(400)
      .json({ message: "first name must contain only letters and spaces" });
  }

  const lastname_regex = /^[a-z\s]+$/i;
  if (!lastname_regex.test(lastname)) {
    return res
      .status(400)
      .json({ message: "last name must contain only letters and spaces" });
  }

  const email_regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email_regex.test(email)) {
    return res.status(400).json({ message: "invalid email format" });
  }

  const password_regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  if (!password_regex.test(password)) {
    return res.status(400).json({
      message:
        "password must be atleast 8 characters long and include uppercase, lowercase, number, and special character",
    });
  }

  try {
    const db = await connect_db();
    const user_collection = db.collection("users");

    const existing_user = await user_collection.findOne({ email });
    if (existing_user) {
      return res.status(409).json({ message: "email already registered" });
    }

    const hashed_password = await bcrypt.hash(password, 10);

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

    await user_collection.insertOne(new_user);
    res.status(201).json({ message: "registration successful" });
  } catch (error) {
    console.error("registration error:", error);
    res.status(500).json({ message: "internal server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }

  try {
    const db = await connect_db();
    const user_collection = db.collection("users");

    const user = await user_collection.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "invalid credentials" });
    }

    const password_match = await bcrypt.compare(password, user.password);
    if (!password_match) {
      return res.status(401).json({ message: "invalid credentials" });
    }

    res.status(200).json({
      message: "login successful",
      user: {
        first_name: user.firstname,
        last_name: user.last_name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("login error:", error);
    res.status(500).json({ message: "internal server error" });
  }
});

export default router;
