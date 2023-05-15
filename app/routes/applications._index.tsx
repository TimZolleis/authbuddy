import { DataFunctionArgs, defer } from '@remix-run/node';
import { PageHeader } from '~/components/ui/PageHeader';
import { Button } from '~/components/ui/Button';
import { prisma } from '~/utils/prisma/prisma.server';
import { requireDeveloper } from '~/utils/auth/session.server';
import { Await, Link, useLoaderData } from '@remix-run/react';
import { Suspense } from 'react';
import { Application } from '.prisma/client';
import { ErrorComponent } from '~/components/features/error/ErrorComponent';

export const loader = async ({ request, params }: DataFunctionArgs) => {
    const user = await requireDeveloper(request);
    const applications = prisma.application
        .findMany({
            where: {
                user: {
                    id: user.id,
                },
            },
        })
        .catch();
    return defer({ applications });
};
const ApplicationPage = () => {
    const { applications } = useLoaderData<typeof loader>();
    return (
        <main>
            <section className={'grid w-full gap-2'}>
                <div className={'flex items-center justify-between border-b border-input pb-2'}>
                    <PageHeader>My Applications</PageHeader>
                    <Link prefetch={'intent'} to={'/applications/new'}>
                        <Button>New Application</Button>
                    </Link>
                </div>
                <Suspense fallback={<p>Loading applications...</p>}>
                    <Await resolve={applications}>
                        {(resolvedApplications) =>
                            resolvedApplications.length > 0 ? (
                                <div className={'mt-5 grid gap-2 md:grid-cols-2 xl:grid-cols-3'}>
                                    {resolvedApplications.map((application) => (
                                        <ApplicationComponent
                                            key={application.id}
                                            application={application}></ApplicationComponent>
                                    ))}
                                </div>
                            ) : (
                                <ErrorComponent
                                    headline={'No applications'}
                                    description={
                                        'Create an application to get started with AuthBuddy.'
                                    }
                                />
                            )
                        }
                    </Await>
                </Suspense>
            </section>
        </main>
    );
};

const ApplicationComponent = ({ application }: { application: Application }) => {
    return (
        <Link
            prefetch={'intent'}
            to={`/applications/${application.id}/settings`}
            className={
                'flex items-center justify-between rounded-md border border-white/30 px-5 py-3 transition duration-200 ease-in-out hover:scale-105 hover:bg-black'
            }>
            <div>
                <p>{application.name}</p>
                <p className={'text-xs text-neutral-500'}>{application.homepage}</p>
            </div>
            <p
                className={`text-xs font-light leading-none ${
                    application.deactivated ? 'text-red-500' : 'text-green-500'
                }`}>
                {application.deactivated ? 'NOT ACTIVE' : 'ACTIVE'}
            </p>
        </Link>
    );
};

export default ApplicationPage;
