import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'
import apiRoutes from "@/routes/api";
import ApiBase from "@/hook/base";
import {fetchDepartments, queryKeyDepartments} from "@/hook/useDepartments";

const queryKeyDocument = "document";

const fetchDocument = async (params) => {
    const response = await new ApiBase().httpGet(apiRoutes.document.list, params);
    return await response.json();
}

const fetchDocumentSearch = async (params) => {
    const response = await new ApiBase().httpGet(apiRoutes.document.search, params);
    return await response.json();
}

const createDocument = async (params) => {
    const response = await new ApiBase().httpPost(apiRoutes.document.create, params);
    return await response.json();
};

const updateDocument = async ({id, params}) => {
    const response = await new ApiBase().httpPut(apiRoutes.document.update.replace(":id", id), params);
    return await response.json();
};

const deletedPermanentlyDocument = async (id) => {
    const response = await new ApiBase().httpDelete(apiRoutes.document.deletePermanently.replace(":id", id));
    return await response.json();
};

const downloadDocument = async (params) => {
    const response = await new ApiBase().httpGet(apiRoutes.document.download, params, {headers: {Accept: "application/octet-stream"}});

    // Kiểm tra phản hồi
    if (!response.ok) {
        throw new Error("Failed to download document");
    }

    // Trả về Blob thay vì JSON
    return await response.blob();
};

const useCreateDocument = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createDocument,
        onSuccess: () => {
            queryClient.invalidateQueries([queryKeyDocument]);
        },
        onError: (error) => {
        },
    });
};

const useDocument = (params) => {
    return useQuery({
        queryKey: [queryKeyDocument, JSON.stringify(params)],
        queryFn: () => fetchDocument(params),
    })
}

const useDocumentSearch = (params) => {
    return useQuery({
        queryKey: params ? [queryKeyDepartments, JSON.stringify(params)] : null, // Không tạo queryKey nếu params null
        queryFn: () => (params ? fetchDocumentSearch(params) : Promise.resolve(null)), // Không fetch nếu params null
        enabled: !!params, // Tắt tự động fetch nếu params không tồn tại
    });
}

const useUpdateDocument = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: updateDocument,
        onSuccess: () => {
            queryClient.invalidateQueries([queryKeyDocument]);
        },
        onError: (error) => {
        },
    });
};

const useDeletePermanentlyDocument = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deletedPermanentlyDocument,
        onSuccess: () => {
            queryClient.invalidateQueries([queryKeyDocument]);
        },
        onError: (error) => {
        },
    });
};

const useDownloadDocument = () => {
    return useMutation({
        mutationFn: downloadDocument,
        onSuccess: (blob, variables) => {
            // Tạo URL từ Blob
            const url = window.URL.createObjectURL(blob);

            // Tạo thẻ <a> tạm thời để kích hoạt tải xuống
            const link = document.createElement("a");
            link.href = url;
            link.download = `${variables.name}`; // Sử dụng tên file từ biến
            document.body.appendChild(link);
            link.click();

            // Dọn dẹp sau khi tải xong
            link.remove();
            window.URL.revokeObjectURL(url);
        },
        onError: (error) => {
            console.error("Error downloading document:", error);
        },
    });
};

export {
    queryKeyDocument,
    useCreateDocument,
    fetchDocument,
    useDocument,
    useDocumentSearch,
    useUpdateDocument,
    useDeletePermanentlyDocument,
    useDownloadDocument,
}
