import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export function GetUserById(userId: any) {
  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/getUserWithId/${userId}`,
    fetcher,
  );
  return {
    userWithID: data,
    isLoading,
    isError: error,
  };
}

export function GetUserProfile(userId: any) {
  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/userProfiles/${userId}`,
    fetcher,
    {
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        // Never retry on 404.
        if (error.status === 404) return;

        // Never retry for a specific key.
        if (key === `${process.env.NEXT_PUBLIC_API_URL}/userProfiles/${userId}`) return;

        // Only retry up to 10 times.
        if (retryCount >= 10) return;

        // Retry after 5 seconds.
        setTimeout(() => revalidate({ retryCount }), 5000);
      },
    },
  );
  return {
    userProfile: data,
    isLoadingUserProfile: isLoading,
    isErrorUserProfile: error,
  };
}

export function GetAllUsers() {
  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/allUsers`,
    fetcher,
  );
  return {
    allUsers: data,
    isLoadingAllUsers: isLoading,
    isErrorAllUsers: error,
  };
}

export function GetAvatar(userId: any) {
  const { data, error, isLoading } = useSWR(  
    `${process.env.NEXT_PUBLIC_API_URL}/getAvatar/${userId}`,
    fetcher,
  );
  return {
    avatar: data,
    isLoadingAvatar: isLoading,
    isErrorAvatar: error,
  };
}

export function GetBanner(userId: any) {
  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/getBanner/${userId}`,
    fetcher,
  );
  return {
    banner: data,
    isLoadingBanner: isLoading,
    isErrorBanner: error,
  };
}
