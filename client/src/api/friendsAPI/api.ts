import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export function GetFriends(userId: any) {
  const { data, error, isLoading } = useSWR(
    `http://localhost:8000/api/getFriends/${userId}`,
    fetcher,
  );
  return {
    friends: data,
    isLoadingFriends: isLoading,
    isErrorFriends: error,
  };
}
