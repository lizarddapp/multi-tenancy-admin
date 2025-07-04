import {
  layout,
  prefix,
  route,
  type RouteConfig,
} from "@react-router/dev/routes";
import { flatRoutes } from "@react-router/fs-routes";

const appRoutes = await flatRoutes();
const unauthenticatedRoutes = await flatRoutes({
  rootDirectory: "./routes-unauthenticated",
});
const controlRoutes = await flatRoutes({
  rootDirectory: "./routes-control",
});
console.log("Generated routes:", appRoutes);
export default [
  ...prefix("_auth", [...unauthenticatedRoutes]),
  ...prefix("_control", [...controlRoutes]),
  layout("./layouts/tenant.tsx", [...prefix(":tenant", [...appRoutes])]),
] satisfies RouteConfig;
