import { RESPONSE_STATUS_CODES } from "../constants";
import { UsersDB } from "../db";
import { User } from "../models";
import { IncomingMessage, createServer } from "node:http";
import url from "node:url";

export class App {
  #port: string | null = null;
  #db: UsersDB | null = null;

  constructor(port: string = "4000") {
    this.#port = port;
  }

  init() {
    this.#db = new UsersDB();
    this.#db.initDB();
  }

  startServer() {
    const server = createServer((req, res) => {
      this.validateRequest(req);

      const { pathname } = url.parse(req.url!, true);

      if (pathname == "/api/users" && req.method == "GET") {
        const users = this.#db?.getAll();

        res.statusCode = RESPONSE_STATUS_CODES.SUCCESS;
        res.setHeader("Content-Type", "application/json");

        res.end(JSON.stringify(users));
      }
      if (pathname == "/api/users" && req.method == "POST") {
        req.on("data", (data) => {
          const params = JSON.parse(data.toString());
          const user = new User(params);

          try {
            this.#db?.create(user);
          } catch (error) {
            req.emit("error", error);
          }

          res.statusCode = RESPONSE_STATUS_CODES.CREATED;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(user));
        });

        // TODO: HANDLE ERROR FROM FILE WRITE
        req.on("error", (err) => {
          console.error(err);

          const message = { message: err.message };
          res.statusCode = RESPONSE_STATUS_CODES.BAD_REQUEST;
          res.end(JSON.stringify(message));
        });
      }
      if (pathname == "/api/users/:id" && req.method == "PUT") {
        //TODO: PUT logic
      }
      if (pathname == "/api/users" && req.method == "DELETE") {
        //TODO: DELETE logic
      }
    });

    server.listen(this.#port);
    console.log(`Server is running on port ${this.#port}`);
  }

  validateRequest(request: IncomingMessage) {
    if (!request.url) {
      throw new Error("No request url provided");
    }
  }
}
