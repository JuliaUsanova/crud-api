import { v4 as uuidv4 } from "uuid";

export class User {
  id: string = "";
  username: string = "";
  age: number = 0;
  hobbies: string[] = [];

  constructor({ username, age, hobbies }: User) {
    this.id = uuidv4();
    this.username = username;
    this.age = age;
    this.hobbies = hobbies;
  }

  static isValid(user: User) {
    return (
      user &&
      user.username.length > 0 &&
      user.age > 0 &&
      user.hobbies &&
      user.hobbies.length >= 0
    );
  }
}
