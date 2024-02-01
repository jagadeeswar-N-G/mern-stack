const dotenv = require("dotenv");
dotenv.config();
import { app } from "./app";
import ConnectDB from "./db";

ConnectDB()
  .then(() => {
    app.listen(process.env.PORT || 8080, () => {
      console.log(`server is running at ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("Mongo db connection failed", error);
  });
