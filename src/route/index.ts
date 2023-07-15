import {FastifyPluginAsync} from "fastify"
import fp from 'fastify-plugin'
import {AppOptions} from "../options";
import wellknown from "./well-known";
import nodeinfo from "./nodeinfo";
import users from "./users";

const routes: FastifyPluginAsync<AppOptions> = async (fastify, opts): Promise<void> => {
    fastify.register(wellknown, opts);
    fastify.register(nodeinfo, opts);
    fastify.register(users, opts);
};

export default fp(routes);
