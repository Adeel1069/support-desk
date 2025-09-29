// These are the role based protected routes
export const protectedRoutes = ["/user(.*)", "/agent(.*)", "/admin(.*)"];
export const publicRoutes = ["/"];

// These are the prefixes of protected routes
export const protectedPreFixes = {
  user: "/user",
  agent: "/agent",
  admin: "/admin",
};
