import { layout, route, type RouteConfig } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

const appRoutes = await flatRoutes();
const unauthenticatedRoutes = await flatRoutes({
  rootDirectory: "./routes-unauthenticated",
});

export default [
  ...unauthenticatedRoutes,

  layout("./layouts/tenant.tsx", [
    ...appRoutes.map((appRoute) => {
      return route(
        `:tenant${appRoute.path ? `/${appRoute.path}` : ""}`,
        appRoute.file,
        appRoute.children
      );
    }),
  ]),
] satisfies RouteConfig;
