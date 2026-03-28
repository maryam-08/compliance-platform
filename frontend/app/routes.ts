import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"), 
  route("register", "routes/register.tsx"), 
  route("company-profile", "routes/company-profile.tsx"),
  route("dashboard", "routes/dashboard.tsx"),
  route("audit", "routes/audit.tsx"),
  route("results", "routes/results.tsx"),
] satisfies RouteConfig;