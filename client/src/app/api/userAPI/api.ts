import useSWR from 'swr'


const fetcher = (...args) => fetch(...args).then(res => res.json())

export function GetUser() {
    const { data, error, isLoading } = useSWR(`http://localhost:8000/api/user`, fetcher)

    return {
        user: data,
        isLoading,
        isError: error
      }

}

export function GetUserById(userId : any) {
    const { data, error, isLoading } = useSWR(`http://localhost:8000/api/getUserWithId/${userId}`, fetcher)

    return {
        userWithID: data,
        isLoading,
        isError: error
      }

}

export function GetUserProfile(userId : any) {
    const { data, error, isLoading } = useSWR(`http://localhost:8000/api/userProfiles/${userId}`, fetcher)

    return {
        userProfile: data,
        isLoadingUserProfile: isLoading,
        isErrorUserProfile: error
      }
}