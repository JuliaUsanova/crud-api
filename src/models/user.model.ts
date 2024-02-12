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

  isValid() {
    return (
      this.username.length > 0 &&
      this.age > 0 &&
      this.hobbies &&
      this.hobbies.length >= 0
    );
  }
}
