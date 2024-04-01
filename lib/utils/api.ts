import { createTRPCProxyClient, httpBatchLink, loggerLink, TRPCLink } from '@trpc/client';
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import { observable } from '@trpc/server/observable';
import { igvfCatalogRouter as AppRouter } from 'igvf-catalog/src/routers/_app';

export const apiBaseUrl = "https://api.catalog.igvf.org/api";

const trpcBaseUrl = "https://api.catalog.igvf.org/trpc";

export const api = createTRPCProxyClient<AppRouter>({
    links: [
        loggerLink({
            enabled: (opts) =>
                process.env.NODE_ENV === "development" ||
                (opts.direction === "down" && opts.result instanceof Error),
        }),
        httpBatchLink({
            url: trpcBaseUrl,
        }),
    ],
});

/**
 * Inference helper for inputs.
 *
 * @example type HelloInput = RouterInputs['example']['hello']
 */
export type RouterInputs = inferRouterInputs<AppRouter>;

/**
 * Inference helper for outputs.
 *
 * @example type HelloOutput = RouterOutputs['example']['hello']
 */
export type RouterOutputs = inferRouterOutputs<AppRouter>;
