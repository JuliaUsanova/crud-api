import { User } from "models/user.model";
import { v4 as uuidv4 } from "uuid";

export class UsersDB {
  #storage = {} as Record<string, User>;

  getAll() {
    return Object.values(this.#storage);
  }

  get(id: string) {
    return this.#storage[id] ?? null;
  }

  create(user: User) {
    if (!(user instanceof User)) {
      throw new Error("Invalid user parameters");
    }
    const id = uuidv4();
    this.#storage[id] = user;
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
}
