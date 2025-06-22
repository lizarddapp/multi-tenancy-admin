import { layout, route, type RouteConfig } from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

const appRoutes = await flatRoutes();
const unauthenticatedRoutes = await flatRoutes({
  rootDirectory: "./routes-unauthenticated",
});
const controlRoutes = await flatRoutes({
  rootDirectory: "./routes-control",
});

export default [
  ...unauthenticatedRoutes.map((unauthenticatedRoute) => {
    console.log(unauthenticatedRoute.path, unauthenticatedRoute.file);
    return route(
      `auth${unauthenticatedRoute.path ? `/${unauthenticatedRoute.path}` : ""}`,
      unauthenticatedRoute.file,
      unauthenticatedRoute.children
    );
  }),

  ...controlRoutes.map((controlRoute) => {
    return route(
      `control${controlRoute.path ? `/${controlRoute.path}` : ""}`,
      controlRoute.file,
      controlRoute.children
    );
  }),

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
