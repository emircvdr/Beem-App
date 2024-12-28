import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

interface Workspaces {
  id: string;
  name: string;
  admin_id: string;
  private: boolean;
}

export function GetWorkspacesWithAdminID(adminID: string) {
  const { data, error, isLoading } = useSWR<Workspaces[]>(
    `http://localhost:8000/api/workplaces/${adminID}`,
    fetcher,
  );
  return {
    workspaces: data,
    isLoadingWorkspaces: isLoading,
    isErrorWorkspaces: error,
  };
}
