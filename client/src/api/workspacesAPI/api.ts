import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

interface Workspaces {
  id: string;
  name: string;
  admin_id: string;
  private: boolean;
  invite_code: string;
}

export function GetWorkspacesWithAdminID(adminID: string) {
  const { data, error, isLoading } = useSWR<Workspaces[]>(
    `${process.env.NEXT_PUBLIC_API_URL}/workplaces/${adminID}`,
    fetcher,
  );
  return {
    workspaces: data,
    isLoadingWorkspaces: isLoading,
    isErrorWorkspaces: error,
  };
}

export function GetWorkspacesWithId(id: string) {
  const { data, error, isLoading } = useSWR<Workspaces>(
    `${process.env.NEXT_PUBLIC_API_URL}/workplaceWithId/${id}`,
    fetcher,
  );
  return {
    workspace: data,
    isLoadingWorkspace: isLoading,
    isErrorWorkspace: error,
  };
}
