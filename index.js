import express from "express";
import "dotenv/config"; // loads environment variables from .env
import connect_db from "./db/db.js";

const app = express();
// parses incoming json requests
app.use(express.json());
// parses url-encoded data (from forms etc)
app.use(express.urlencoded({ extended: true }));
await connect_db();
const PORT = process.env.PORT || 5000; // sets port from env or defaults to 5000

// root route
app.get("/", (req, res) => {
  res.send("HELLO, WORLD!");
});

// starts the server
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
