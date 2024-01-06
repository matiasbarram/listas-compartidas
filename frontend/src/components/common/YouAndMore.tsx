import { IUserData } from '../../../types';

interface IYouAndMore {
  users: IUserData[];
  className?: string;
}

export const YouAndMore = ({ users, className }: IYouAndMore) => {
  return (
    <div
      className={`flex-shrink-0 text-sm font-medium text-gray-500 ${className}`}
    >
      {users.length === 1
        ? 'Solo tú'
        : users.length === 2
        ? `Tu y 1 más`
        : `Tu y ${users.length - 1} más`}
    </div>
  );
};
