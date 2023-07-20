import {User} from "../domain/user";
import {Repository} from "./interface";
import {userCache} from "../datastore/onmemory";

export default class UserRepository implements Repository<User> {
    find(name: string) {
        return userCache.get(name);
    }

    save(user: User) {
        userCache.set(user.name, user);
    }
}
