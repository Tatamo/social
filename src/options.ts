import {AutoloadPluginOptions} from "@fastify/autoload";

export type AppOptions = {
    protocol: string
    host: string
    acctHost: string
} & Partial<AutoloadPluginOptions>;
