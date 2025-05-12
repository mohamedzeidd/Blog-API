require("dotenv").config({ path: "./config.env" });
const app = require("./app");
const mongoose = require("mongoose");
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => console.log("Successfully connected to database"));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
  console.log(process.env.NODE_ENV);
});
