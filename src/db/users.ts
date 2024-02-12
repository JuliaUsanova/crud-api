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

  get(id: string) {
    return this.#storage[id] ?? null;
  }

  create(user: User) {
    if (!(user instanceof User) || !user.isValid()) {
      throw new Error("Invalid user parameters");
    }

    this.#storage[user.id] = user;
    this.#updateData(Object.values(this.#storage));
  }

  update(id: string, userParams: User) {
    const storedUser = this.#find(id);

    this.#storage[storedUser.id] = userParams;
  }

  delete(id: string) {
    const storedUser = this.#find(id);

    delete this.#storage[storedUser.id];
  }

  #find(id: string) {
    const user = this.get(id);

    if (!user) throw new Error("User not found");

    return user;
  }

  async #updateData(users: User[]) {
    const usersJson = JSON.stringify(users);

    await writeFile(this.#dataPath, usersJson, { encoding: "utf8" });
  }
}
