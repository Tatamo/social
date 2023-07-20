import {User} from "../domain/user";
import {Repository} from "./interface";

export default class UserRepository implements Repository<User> {
    save(user: User) {
    }
}
