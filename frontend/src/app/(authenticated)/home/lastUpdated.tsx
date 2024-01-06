'use client';

import { HomeCard } from '@/components/home/homeCard';
import { getLastUpdatedLists } from '@/lib/actions/lists/lists';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { Fragment } from 'react';
import { IGetLists } from '../../../../types';

export default function LastUpdatedLists({
  lists: initialList,
  token,
}: {
  lists: IGetLists;
  token: string;
}) {
  const { status, data: session } = useSession();

  const {
    data: lists,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['lastUpdatedLists'],
    queryFn: () => getLastUpdatedLists({ token }),
    initialData: initialList,
  });

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {lists.lists.map((list, index) => (
        <Fragment key={index}>
          <HomeCard listData={list} />
        </Fragment>
      ))}
    </div>
  );
}
