import {User} from "../domain/user";

export const cache = new Map();

export const userCache = new Map<string, User>;
