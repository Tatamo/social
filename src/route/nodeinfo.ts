import {FastifyPluginAsync} from "fastify"
import fp from 'fastify-plugin'

const nodeinfo: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
    fastify.get('/nodeinfo/2.1', async function (request, reply) {
        reply.type(`application/json; profile="http://nodeinfo.diaspora.software/ns/schema/2.1#"`)
        return {
            "version": "2.1",
            "software": {
                "name": "tatamo-social",
                "version": "0.0.1",
                "repository": "https://github.com/Tatamo/social"
            },
            "protocols": [
                "activitypub"
            ],
            "services": {
                "inbound": [],
                "outbound": []
            },
            "openRegistrations": false,
            "usage": {
                // TODO: output total users, total posts, etc.
                "users": {}
            },
            "metadata": {}
        };
    });
};

export default fp(nodeinfo);
