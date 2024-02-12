import { UsersDB } from "db/users";
import { config } from "dotenv";
config();

const port = process.env.PORT;

function app() {
  console.log(`Server is running on port ${port}`);

  const db = new UsersDB();

  console.log(db.getAll());
}

app();
