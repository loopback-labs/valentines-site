import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
    },
  },
});

// Everything an owner sees lives under ["sites"], so invalidating that prefix
// after a create/edit/delete refreshes the dashboard, editor and responses.
export const queryKeys = {
  mySites: (userId: string | undefined) => ["sites", "list", userId] as const,
  site: (id: string | undefined) => ["sites", "detail", id] as const,
  siteResponses: (id: string | undefined) => ["sites", "responses", id] as const,
  publicSite: (slug: string | undefined) => ["public-site", slug] as const,
};
