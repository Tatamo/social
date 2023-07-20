import {Controller} from "../helper";
import {User} from "../../domain/user";

export const createUser: Controller<{
    Body: { name: string, displayName: string, language?: string, summary?: string }
}> = repositories => async (request, reply) => {
    const {userRepository} = repositories;
    const {name, displayName, language, summary} = request.body;
    const user: User = {
        name,
        displayName,
        language: language ?? "ja",
        summary: summary ?? "",
        properties: []
    }
    userRepository.save(user);
}
