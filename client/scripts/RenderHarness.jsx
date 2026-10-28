import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

/** Wraps a page in the providers it needs for a server-side render smoke test. */
export function wrap(Component) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return React.createElement(
    QueryClientProvider,
    { client: queryClient },
    React.createElement(MemoryRouter, { initialEntries: ['/'] }, React.createElement(Component)),
  );
}
