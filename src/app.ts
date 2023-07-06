import { join } from 'path';
import AutoLoad, {AutoloadPluginOptions} from '@fastify/autoload';
import { FastifyPluginAsync } from 'fastify';
import wellknown from "./routes/well-known";

export type AppOptions = {
  // Place your custom options for app below here.
  protocol: string
  host: string
} & Partial<AutoloadPluginOptions>;


// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {
  protocol: "",
  host: "localhost:3000"
}

const app: FastifyPluginAsync<AppOptions> = async (
    fastify,
    opts
): Promise<void> => {
  // Place here your custom code!

  // work-around for https://github.com/fastify/fastify-cli/issues/593
  opts = {...options, ...opts}

  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  void fastify.register(AutoLoad, {
    dir: join(__dirname, 'plugins'),
    options: opts
  })

  fastify.register(wellknown, opts);
};

export default app;
export { app, options }
