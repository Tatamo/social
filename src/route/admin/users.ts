import {FastifyPluginAsync} from "fastify"
import fp from 'fastify-plugin'
import {FastifySchema} from "fastify/types/schema";
import {createUser} from "../../controller/admin/users";

const createUserSchema: FastifySchema = {
    body: {
        type: "object",
        required: ["name", "displayName"],
        properties: {
            name: {type: "string"},
            displayName: {type: "string"},
            language: {type: "string"},
            summary: {type: "string"}
        }
    }
}

const users: FastifyPluginAsync<{
    protocol: string,
    host: string
}> = async (fastify, opts): Promise<void> => {
    fastify.post("/admin/users", {schema: createUserSchema}, createUser(fastify.getRepositories()));
};

export default fp(users);
