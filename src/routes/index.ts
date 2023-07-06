import {FastifyPluginAsync} from "fastify"
import fp from 'fastify-plugin'
import wellknown from "./well-known";
import {AppOptions} from "../options";

const routes: FastifyPluginAsync<AppOptions> = async (fastify, opts): Promise<void> => {
    fastify.register(wellknown, opts);
}

export default fp(routes);
