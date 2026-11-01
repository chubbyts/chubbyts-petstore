import type { Route } from '@chubbyts/chubbyts-framework/router/route';
import type { Handler } from '@chubbyts/chubbyts-http-types/handler';
import type { Response, ServerRequest } from '@chubbyts/chubbyts-http-types/message';

export const routeTestingResolveAllLazyMiddlewaresAndHandlers = async (
  routes: Array<Route>,
  request: ServerRequest,
  response: Response,
): Promise<void> => {
  // all middlewares (wrapped as handler) and handlers of this routesServiceDelegator
  const handlers: Array<Handler> = routes.flatMap((route) => [
    ...route.middlewares.map((middleware) => {
      return (middlewareRequest: ServerRequest) => middleware(middlewareRequest, async () => response);
    }),
    route.handler,
  ]);

  await Promise.all(handlers.map((handler) => handler(request)));
};
