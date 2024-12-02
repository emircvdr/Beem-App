import useSWR from 'swr';

const fetcher = async (...args: [RequestInfo, RequestInit?]) => {
  const res = await fetch(...args);

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error('An error occurred while fetching the data.');
  }

  return res.json();
};

export function GetFriendRequestWithSenderandReceiverId(senderId: any, receiverId: any) {
  const { data, error, isLoading } = useSWR(
    `http://localhost:8000/api/getFriendRequestWithSenderandReceiverId/${senderId}/${receiverId}`,
    fetcher,
  );

  return {
    friendRequest: data,
    isLoadingFriendRequest: isLoading,
    isErrorFriendRequest: !!error,
  };
}
