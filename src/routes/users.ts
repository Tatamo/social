import {FastifyPluginAsync} from "fastify"
import fp from 'fastify-plugin'
import {FastifySchema} from "fastify/types/schema";

const userSchema: FastifySchema = {
    params: {
        type: "object",
        required: ["name"],
        properties: {
            name: {
                type: "string",
                pattern: `^[a-zA-Z0-9._~-]+$` // TODO: accept percent encoding
            }
        }
    }
};
const wellknown: FastifyPluginAsync<{
    protocol: string,
    host: string
}> = async (fastify, opts): Promise<void> => {
    // https://www.w3.org/TR/activitypub/#actor-objects
    fastify.get<{ Params: { name: string } }>('/users/:name', {schema: userSchema}, async function (request, reply) {
        const {name} = request.params;
        reply.type("application/activity+json");
        return {
            "@context": "https://www.w3.org/ns/activitystreams",
            type: "Person",
            id: `${opts.protocol}${opts.host}/users/${name}`,
            preferredUsername: name,
            name: name,
            // following: "",
            // followers: "",
            // linked: "",
            // liked:"",
            inbox: `${opts.protocol}${opts.host}/users/${name}/inbox`,
            outbox: `${opts.protocol}${opts.host}/users/${name}/outbox`,
            // icon: [{type: "Image", url: ""}]
        };
    });

    // https://www.w3.org/TR/activitypub/#inbox
    fastify.get<{
        Params: { name: string }
    }>('/users/:name/inbox', {schema: userSchema}, async function (request, reply) {
        const {name} = request.params;
        reply.type("application/activity+json");
        return {
            "@context": "https://www.w3.org/ns/activitystreams",
            type: "OrderedCollection",
            id: `${opts.protocol}${opts.host}/users/${name}/inbox`,
            preferredUsername: name,
            totalItems: 0,
            orderedItems: [],
        };
    });

    // https://argrath.github.io/activitypub/#delivery
    fastify.post<{
        Params: { name: string }
    }>('/users/:name/inbox', {schema: userSchema}, async function (request, reply) {
        // const {name} = request.params;
        // TODO: implement
        reply.code(405);
        return;
    });
};

export default fp(wellknown);
