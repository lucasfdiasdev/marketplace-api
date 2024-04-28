import "dotenv/config";
import { app } from "./config/app";
import { connectDb } from "./config/db";

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectDb();
});
