import {Repository} from "./interface";
import {User} from "../domain/user";

export type Repositories = {
    userRepository: Repository<User>;
};
