const mongoose = require("mongoose");

// Replace the connection string and database name with your own values
const uri =
  "mongodb+srv://gustafgroning:Gg97newfold@cluster0.pi3xgas.mongodb.net/apex?retryWrites=true&w=majority";

mongoose.connect(uri);

const db = mongoose.connection;

db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to database"));
module.exports = db;
