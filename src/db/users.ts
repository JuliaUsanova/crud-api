import { readFile, writeFile } from "node:fs/promises";
import { User } from "../models";
import { resolve } from "node:path";

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
    if (!id || this.#storage[id]) {
      throw new Error("Get failed. Invalid user id");
    }

    return this.#storage[id];
  }

  async create(user: User) {
    if (!User.isValid(user)) {
      throw new Error("Create failed. Invalid user parameters");
    }

    this.#storage[user.id] = user;

    await this.#updateData(Object.values(this.#storage));
  }

  async update(userParams: User, id?: string) {
    if (!id || !User.isValid(userParams)) {
      throw new Error("Update failed. Invalid user parameters");
    } else if (!this.#storage[id]) {
      throw new Error("Update failed. User doesnt exist");
    }
    const storedUser = this.#find(id);

    this.#storage[storedUser.id] = { ...storedUser, ...userParams };
    await this.#updateData(Object.values(this.#storage));
  }

  async delete(id?: string) {
    if (!id || !this.#storage[id]) {
      throw new Error("Delete failed. Invalid user id");
    }
    const storedUser = this.#find(id);

    delete this.#storage[storedUser.id];
    await this.#updateData(Object.values(this.#storage));
  }

  #find(id: string) {
    const user = this.get(id);

    if (!user) throw new Error("User not found");

    return user;
  }

  async #updateData(users: User[]) {
    const usersJson = JSON.stringify(users);

    try {
      await writeFile(this.#dataPath, usersJson, { encoding: "utf8" });
    } catch (error) {
      throw new Error("Internal server error");
    }
  }
}
