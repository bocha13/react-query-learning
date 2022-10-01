import { useQuery } from 'react-query'
export function useUserData(userId) {
  const usersData = useQuery(['users', userId], ({ signal }) =>
    fetch(`/api/users/${userId}`, { signal }).then((res) => res.json())
  )

  return usersData
}
