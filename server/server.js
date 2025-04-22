const app = require("./src/app");
const connct = require("./src/db/db");
const dotenv = require("dotenv");
dotenv.config();
connct();

app.listen(process.env.PORT, () => {
  console.log("Server is running on port ");
});
