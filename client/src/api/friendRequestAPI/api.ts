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
  const shouldFetch = senderId !== 0 && receiverId !== 0;
  const { data, error, isLoading } = useSWR(
    shouldFetch
      ? `${process.env.NEXT_PUBLIC_API_URL}/getFriendRequestWithSenderandReceiverId/${senderId}/${receiverId}`
      : null,
    fetcher,
  );

  return {
    friendRequest: data,
    isLoadingFriendRequest: isLoading,
    isErrorFriendRequest: !!error,
  };
}

export function GetPendingFriendRequests(senderId: any) {
  const shouldFetch = senderId !== 0;
  const { data, error, isLoading } = useSWR(
    shouldFetch
      ? `${process.env.NEXT_PUBLIC_API_URL}/getPendingFriendRequests/${senderId}`
      : null,
    fetcher,
  );

  return {
    pendingFriendRequests: data,
    isLoadingPendingFriendRequests: isLoading,
    isErrorPendingFriendRequests: !!error,
  };
}

export function GetFriendRequestsByReceiverId(receiverId: any) {
  const shouldFetch = receiverId !== 0;
  const { data, error, isLoading } = useSWR(
    shouldFetch
      ? `${process.env.NEXT_PUBLIC_API_URL}/getFriendRequestsByReceiverId/${receiverId}`
      : null,
    fetcher,
  );

  return {
    friendRequests: data,
    isLoadingFriendRequests: isLoading,
    isErrorFriendRequests: !!error,
  };
}
