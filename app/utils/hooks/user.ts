import { useMatches } from '@remix-run/react';
import { useMemo } from 'react';
import { User } from '~/utils/auth/user.server';

export function useMatchesData(id: string): Record<string, unknown> | undefined {
    const matchingRoutes = useMatches();
    const route = useMemo(
        () => matchingRoutes.find((route) => route.id === id),
        [matchingRoutes, id]
    );
    return route?.data;
}

export function useOptionalUser(): User | undefined {
    const data = useMatchesData('root');
    return data?.user as User | undefined;
}

export function getRedactedString() {
    return '*'.repeat(16);
}
