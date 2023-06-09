import type { DataFunctionArgs } from '@remix-run/node';
import { redirect } from '@remix-run/node';
import { setUser } from '~/utils/auth/session.server';
import { getProviderFromParam } from '~/routes/internal.auth.$provider';
//This component is responsible for retrieving the actual access tokens and information by the token
export const loader = async ({ request, params }: DataFunctionArgs) => {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    if (!code) {
        throw redirect('/login');
    }
    const authenticator = getProviderFromParam(params);
    const token = await authenticator.getAccessToken(code);
    console.log(token);
    if (!token) {
        throw redirect('/login');
    }
    const user = await authenticator.getUserInformation(token);
    if (user) {
        const setSessionHeader = await setUser(request, user);
        return redirect('/', {
            headers: {
                'Set-Cookie': setSessionHeader,
            },
        });
    }
    return redirect('/login');
};
