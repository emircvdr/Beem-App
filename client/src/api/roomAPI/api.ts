import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export function GetRooms() {
  const { data, error, isLoading } = useSWR(
    'http://localhost:8000/api/getRooms',
    fetcher,
  );
  return {
    rooms: data,
    isLoadingRooms: isLoading,
    isErrorRooms: error,
  };
}

export function GetRoomWithId(roomId: string) {
  const { data, error, isLoading } = useSWR(
    `http://localhost:8000/api/getRoomsWithId/${roomId}`,
    fetcher,
  );
  return {
    room: data,
    isLoadingRoom: isLoading,
    isErrorRoom: error,
  };
}
