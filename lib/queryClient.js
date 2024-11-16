// queryClient.js
import {QueryClient} from '@tanstack/react-query';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: 1,
            refetchOnWindowFocus: false, // Không tự động refetch khi đổi tab
        },
    },
});

export default queryClient;
