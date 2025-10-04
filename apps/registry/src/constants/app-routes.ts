const APP_ROUTES_BASE = "";

const APP_ROUTES = {
  REGISTRY: {
    GET_BY_NAME: (name: string) =>
      `${APP_ROUTES_BASE}/registry/components/${name}`,
  },
} as const;

export { APP_ROUTES, APP_ROUTES_BASE };
