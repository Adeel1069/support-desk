// These are the role based protected routes
export const protectedRoutes = ["/user(.*)", "/agent(.*)", "/admin(.*)"];
export const publicRoutes = ["/"];

// These are the prefixes of protected routes
export const protectedPreFixes = {
  user: "/user",
  agent: "/agent",
  admin: "/admin",
};

export const priorities = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "CRITICAL", label: "Critical" },
] as const;

export const userRoles = [
  { value: "USER", label: "User" },
  { value: "AGENT", label: "Agent" },
  { value: "ADMIN", label: "Admin" },
] as const;
