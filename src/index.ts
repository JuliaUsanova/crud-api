import { App } from "./app";
import { config } from "dotenv";
config();

const app = new App(process.env.PORT);

app.init();
app.startServer();
