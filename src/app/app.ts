import { RESPONSE_STATUS_CODES, STATUS_MESSAGES } from "../constants";
import { UsersDB } from "../db";
import { User } from "../models";
import { IncomingMessage, createServer } from "node:http";
import url from "node:url";

// TODO: HOW TO CATCH INTERNAL SERVER ERRORS?
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
    const server = createServer(async (req, res) => {
      this.validateRequest(req);

      const { pathname } = url.parse(req.url!, true);

      if (
        pathname?.match(/\/api\/users\/([0-9a-fA-F]-)*[0-9a-fA-F]/g) &&
        req.method == "GET"
      ) {
        const id = pathname.split("/")[3];
        try {
          const user = this.#db?.get(id);
          res.statusCode = RESPONSE_STATUS_CODES.CREATED;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(user));
        } catch (error) {
          const message = {
            message: STATUS_MESSAGES[RESPONSE_STATUS_CODES.BAD_REQUEST],
            details: error,
          };
          res.statusCode = RESPONSE_STATUS_CODES.BAD_REQUEST;
          res.end(JSON.stringify(message));
        }
      } else if (pathname?.match(/\/api\/users/) && req.method == "GET") {
        const users = this.#db?.getAll();

        res.statusCode = RESPONSE_STATUS_CODES.SUCCESS;
        res.setHeader("Content-Type", "application/json");

        res.end(JSON.stringify(users));
      } else if (pathname?.match(/\/api\/users/) && req.method == "POST") {
        req.on("data", async (data) => {
          const params = JSON.parse(data.toString());
          const user = new User(params);

          try {
            await this.#db?.create(user);
          } catch (error) {
            req.emit("error", error);
          }

          res.statusCode = RESPONSE_STATUS_CODES.CREATED;
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify(user));
        });

        req.on("error", (err) => {
          console.error(err);

          const message = {
            message: STATUS_MESSAGES[RESPONSE_STATUS_CODES.BAD_REQUEST],
            details: err,
          };
          res.statusCode = RESPONSE_STATUS_CODES.BAD_REQUEST;
          res.end(JSON.stringify(message));
        });
      } else if (
        pathname?.match(/\/api\/users\/([0-9a-fA-F]-)*[0-9a-fA-F]/g) &&
        req.method == "PUT"
      ) {
        const id = pathname.split("/")[3];

        req.on("data", async (data) => {
          const user = JSON.parse(data.toString());

          try {
            await this.#db?.update(user, id);
            res.statusCode = RESPONSE_STATUS_CODES.CREATED;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify(user));
          } catch (error) {
            req.emit("error", error);
          }
        });

        req.on("error", (err) => {
          console.error(err);

          const message = {
            message: STATUS_MESSAGES[RESPONSE_STATUS_CODES.BAD_REQUEST],
            details: err,
          };
          res.statusCode = RESPONSE_STATUS_CODES.BAD_REQUEST;
          res.end(JSON.stringify(message));
        });
      } else if (
        pathname?.match(/\/api\/users\/([0-9a-fA-F]-)*[0-9a-fA-F]/g) &&
        req.method == "DELETE"
      ) {
        const id = pathname.split("/")[3];

        try {
          await this.#db?.delete(id);
          res.statusCode = RESPONSE_STATUS_CODES.NO_CONTENT;
          res.end();
        } catch (err) {
          const message = {
            message: STATUS_MESSAGES[RESPONSE_STATUS_CODES.BAD_REQUEST],
            details: err,
          };
          res.statusCode = RESPONSE_STATUS_CODES.BAD_REQUEST;
          res.end(JSON.stringify(message));
        }
      } else {
        const message = {
          message: STATUS_MESSAGES[RESPONSE_STATUS_CODES.BAD_REQUEST],
          details: "Invalid endpoint or method",
        };
        res.statusCode = RESPONSE_STATUS_CODES.BAD_REQUEST;
        res.end(JSON.stringify(message));
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
