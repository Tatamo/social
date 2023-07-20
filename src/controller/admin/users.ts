import {Controller} from "../helper";

export const createUser: Controller<{
    Body: { name: string, displayName: string, language?: string, summary?: string }
}> = repositories => async (request, reply) => {
    const {userRepository} = repositories;
}
