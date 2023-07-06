import {AutoloadPluginOptions} from "@fastify/autoload";

export type AppOptions = {
    // Place your custom options for app below here.
    protocol: string
    host: string
} & Partial<AutoloadPluginOptions>;
