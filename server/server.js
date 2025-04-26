const dotenv = require("dotenv");
dotenv.config();
const app = require("./src/app");
const connct = require("./src/db/db");
connct();

app.listen(process.env.PORT, () => {
  console.log("Server is running on port " + process.env.PORT);
});
