import {RouteGenericInterface, RouteHandlerMethod} from "fastify/types/route";
import {RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault} from "fastify/types/utils";
import {Repositories} from "../repository"

export type FastifyHandler<T extends RouteGenericInterface> = RouteHandlerMethod<RawServerDefault, RawRequestDefaultExpression, RawReplyDefaultExpression, T>;
export type Controller<T extends RouteGenericInterface> = (repositories: Repositories) => (request: Parameters<FastifyHandler<T>>[0], reply: Parameters<FastifyHandler<T>>[1]) => ReturnType<FastifyHandler<T>>;

