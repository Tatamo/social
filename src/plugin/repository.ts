import fp from "fastify-plugin"
import {Repositories} from "../repository";

// The use of fastify-plugin is required to be able
// to export the decorators to the outer scope
export default (repositories: Repositories) => fp(async (fastify, opts) => {
    fastify.decorate("getRepositories", function () {
        return repositories;
    })
})

// When using .decorate you have to specify added properties for Typescript
declare module "fastify" {
    export interface FastifyInstance {
        getRepositories(): Repositories;
    }
}
