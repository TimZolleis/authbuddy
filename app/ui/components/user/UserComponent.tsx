import { InternalUser } from '~/utils/internal-auth/user.server';

export const UserComponent = ({ user }: { user: InternalUser }) => {
    return (
        <section>
            <img className={'h-8 rounded-full'} src={user.avatarUrl} alt='' />
        </section>
    );
};
