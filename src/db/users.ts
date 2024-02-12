import { readFile, writeFile } from "node:fs/promises";
import { User } from "../models";
import { resolve } from "node:path";
import { USERS_DB_ERRORS_MAP } from "../constants";

export class UsersDB {
  #dataPath = resolve(__dirname, "../data.json");
  #storage = {} as Record<string, User>;

  async initDB() {
    const data = await readFile(this.#dataPath, { encoding: "utf8" });
    const parsedData = JSON.parse(data);
    parsedData.forEach((user: User) => {
      this.#storage[user.id] = user;
    });
  }

  getAll() {
    return Object.values(this.#storage);
  }

  get(id?: string) {
    if (!id) {
      throw new Error("Please provide user id", {
        cause: USERS_DB_ERRORS_MAP.BAD_REQUEST,
      });
    } else if (!this.#storage[id]) {
      throw new Error("Invalid user id", {
        cause: USERS_DB_ERRORS_MAP.NOT_FOUND,
      });
    }

    return this.#storage[id];
  }

  async create(user: User) {
    if (!User.isValid(user)) {
      throw new Error("Please provide username, age and hobbies", {
        cause: USERS_DB_ERRORS_MAP.BAD_REQUEST,
      });
    }

    this.#storage[user.id] = user;

    await this.#updateData(Object.values(this.#storage));
  }

  async update(userParams: User, id?: string) {
    if (!id || !User.isValid(userParams)) {
      throw new Error(
        "Please provide username, age and hobbies in body and user id in path",
        {
          cause: USERS_DB_ERRORS_MAP.BAD_REQUEST,
        }
      );
    } else if (!this.#storage[id]) {
      throw new Error("Invalid user id", {
        cause: USERS_DB_ERRORS_MAP.NOT_FOUND,
      });
    }
    const storedUser = this.#find(id);

    this.#storage[storedUser.id] = { ...storedUser, ...userParams };
    await this.#updateData(Object.values(this.#storage));
  }

  async delete(id?: string) {
    if (!id) {
      throw new Error("Please provide user id", {
        cause: USERS_DB_ERRORS_MAP.BAD_REQUEST,
      });
    } else if (!this.#storage[id]) {
      throw new Error("Invalid user id", {
        cause: USERS_DB_ERRORS_MAP.NOT_FOUND,
      });
    }
    const storedUser = this.#find(id);

    delete this.#storage[storedUser.id];
    await this.#updateData(Object.values(this.#storage));
  }

  #find(id: string) {
    const user = this.get(id);

    if (!user) {
      throw new Error("Please provide user id", {
        cause: USERS_DB_ERRORS_MAP.BAD_REQUEST,
      });
    }

    return user;
  }

  async #updateData(users: User[]) {
    const usersJson = JSON.stringify(users);

    try {
      await writeFile(this.#dataPath, usersJson, { encoding: "utf8" });
    } catch (error) {
      throw new Error("Sorry, something went wrong", {
        cause: USERS_DB_ERRORS_MAP.INTERNAL,
      });
    }
  }
}
