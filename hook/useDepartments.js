import {useQuery} from '@tanstack/react-query'

const queryKeyDepartments = "user";

const fetchDepartments = async (limit = 10) => {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts')
    const data = await response.json()
    return data.filter((x) => x.id <= limit)
}

const useDepartments = (limit) => {
    return useQuery({
        queryKey: [queryKeyDepartments, limit],
        queryFn: () => fetchDepartments(limit),
    })
}

export {queryKeyDepartments, useDepartments, fetchDepartments}
