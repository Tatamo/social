import {FastifyPluginAsync} from "fastify"
import fp from 'fastify-plugin'

const wellknown: FastifyPluginAsync<{protocol:string, host: string}> = async (fastify, opts): Promise<void> => {
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
    })
}

export default fp(wellknown);
