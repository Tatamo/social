import {FastifyPluginAsync} from "fastify"
import fp from 'fastify-plugin'
import {FastifySchema} from "fastify/types/schema";

const webfingerSchema: FastifySchema = {
    querystring: {
        type: "object",
        required: ["resource"],
        properties: {
            resource: {
                type: "string",
                pattern: `^acct:[a-zA-Z0-9._~-]+@[a-zA-Z0-9._~-]+$` // TODO: accept percent encoding
            }
        }
    }
};
const wellknown: FastifyPluginAsync<{
    protocol: string,
    host: string,
    acctHost: string
}> = async (fastify, opts): Promise<void> => {
    fastify.get('/.well-known/nodeinfo', async function (request, reply) {
        return {
            "links": [{
                "rel": "http://nodeinfo.diaspora.software/ns/schema/2.0",
                "href": `${opts.protocol}${opts.host}/nodeinfo/2.0`
            }, {
                "rel": "http://nodeinfo.diaspora.software/ns/schema/2.1",
                "href": `${opts.protocol}${opts.host}/nodeinfo/2.1`
            }]
        }
    });

    // https://datatracker.ietf.org/doc/html/rfc7033
    // https://datatracker.ietf.org/doc/html/rfc7565
    fastify.get<{
        Querystring: {
            resource: string
        }
    }>('/.well-known/webfinger', {schema: webfingerSchema}, async function (request, reply) {
        const match = /^acct:([a-zA-Z0-9._~-]+)@([a-zA-Z0-9._~-]+)$/.exec(request.query.resource);
        if (match === null) {
            reply.code(400);
            return;
        }
        const [, user, host] = match;

        if (host !== opts.acctHost) {
            reply.code(404);
            return;
        }

        // TODO: check actor
        if (user !== "tatamo") {
            reply.code(404);
            return;
        }

        reply.type("application/jrd+json")
        return {
            subject: `acct:${user}@${opts.acctHost}`,
            aliases: [
                `${opts.protocol}${opts.host}/users/${user}`,
                `${opts.protocol}${opts.host}/@${user}`
            ],
            links: [
                {
                    rel: "self",
                    type: "application/activity+json",
                    href: `${opts.protocol}${opts.host}/users/${user}`
                },
                {
                    rel: "http://webfinger.net/rel/profile-page",
                    type: "text/html",
                    href: `${opts.protocol}${opts.host}/@${user}`
                }
            ]
        }
    });
}

export default fp(wellknown);
