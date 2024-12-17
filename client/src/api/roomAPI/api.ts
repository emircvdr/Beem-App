import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export function GetRooms() {
  const { data, error, isLoading } = useSWR(
    'http://localhost:8000/ws/get-rooms',
    fetcher,
  );
  return {
    rooms: data,
    isLoadingRooms: isLoading,
    isErrorRooms: error,
  };
}
