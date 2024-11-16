import {useMutation} from '@tanstack/react-query'

const queryKeyUsers = "user";

const loginUser = async (params) => {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(params),
    });

    // if (!response.ok) {
    throw new Error('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    // }

    // const data = await response.json();
    // return data;

    // const response = await fetch('https://jsonplaceholder.typicode.com/posts')
    // const data = await response.json()
    // return data.filter((x) => x.id <= limit)
}

const useLogin = () => {
    return useMutation({
        mutationFn: loginUser,
    });
}

export {queryKeyUsers, useLogin, loginUser}
