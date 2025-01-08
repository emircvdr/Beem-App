import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

export function GetWorkplaceReqWithSenderId(senderId: any) {
  const { data, error, isLoading } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/getWorkplaceReqWithSenderId/${senderId}`,
    fetcher,
  );
  return {
    workplaceReq: data,
    isLoadingWorkplaceReq: isLoading,
    isErrorWorkplaceReq: error,
  };
}
