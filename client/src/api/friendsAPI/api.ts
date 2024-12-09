import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export function GetFriends(userId: any) {
  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/getFriends/${userId}`,
    fetcher,
  );
  return {
    friends: data,
    isLoadingFriends: isLoading,
    isErrorFriends: error,
  };
}
