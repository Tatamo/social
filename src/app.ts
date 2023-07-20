import { join } from 'path';
import AutoLoad from '@fastify/autoload';
import { FastifyPluginAsync } from 'fastify';
import {AppOptions} from "./options";
import sensible from "./plugin/sensible"
import injectRepositories from "./plugin/repository"
import routes from "./route";
import {Repositories} from "./repository";
import UserRepository from "./repository/user";

// Pass --options via CLI arguments in command to enable these options.
const options: AppOptions = {
  protocol: "",
  host: "localhost:3000",
  acctHost: "social.tatamo.dev"
}

const repositories: Repositories = {
  userRepository: new UserRepository()
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

  // load plugins
  fastify.register(sensible, opts);
  fastify.register(injectRepositories(repositories), opts);

  // register routes
  fastify.register(routes, opts);
};

export default app;
export { app, options }
