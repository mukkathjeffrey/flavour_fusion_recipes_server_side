import { MongoClient, ServerApiVersion } from "mongodb";

const MONGO_URI = process.env.MONGO_URI;

const client = new MongoClient(MONGO_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db = null;

async function connect_db() {
  if (db) return db;

  try {
    await client.connect();
    db = client.db("flavour_fusion_recipes");
    await db.command({ ping: 1 });
    console.log(
      "pinged your deployment. you successfully connected to mongodb!"
    );
    return db;
  } catch (error) {
    console.error("failed to connect to mongodb:", error);
    throw error;
  }
}

process.on("SIGINT", async () => {
  try {
    console.log("closing mongodb connection...");
    await client.close();
    console.log("mongodb connection closed. exiting process.");
    process.exit(0);
  } catch (error) {
    console.error("error closing mongodb connection:", error);
    process.exit(1);
  }
});

export default connect_db;
