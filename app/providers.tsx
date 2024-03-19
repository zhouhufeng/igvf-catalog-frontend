'use client';

import { Next13ProgressBar } from 'next13-progressbar';
import ReduxProvider from './_redux/provider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <>
            <ReduxProvider>
                <QueryClientProvider client={queryClient}>
                    {children}
                    <Next13ProgressBar height="4px" color="#337788" options={{ showSpinner: false, minimum: 0.25 }} showOnShallow />
                </QueryClientProvider>
            </ReduxProvider>
        </>
    );
};
