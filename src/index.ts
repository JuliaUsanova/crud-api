import { UsersDB } from "db";
import { config } from "dotenv";
config();

const port = process.env.PORT;

class App {
  static start() {
    console.log(`Server is running on port ${port}`);

    const db = new UsersDB();
    db.initDB();
  }
}

App.start();
