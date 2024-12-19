import envConfig from "@/utils/envConfig";
import {getCookie} from "@/utils/common";

/**
 * https://tanstack.com/query/latest/docs/framework/react/examples/nextjs
 */
class ApiBase {
    httpPost(uri, data, options) {
        return this.httpRequest(uri, "POST", data, options);
    }

    httpPut(uri, data, options) {
        return this.httpRequest(uri, "PUT", data, options);
    }

    httpGet(uri, params, options) {
        // Xử lý query params (nếu có)
        let queryString = "";
        if (params) {
            const searchParams = new URLSearchParams();
            Object.keys(params).forEach((key) => {
                if (Array.isArray(params[key])) {
                    params[key].forEach((value) => {
                        searchParams.append(key, value);
                    });
                } else {
                    searchParams.append(key, params[key]);
                }
            });
            queryString = `?${searchParams.toString()}`;
        }

        return this.httpRequest(`${uri}${queryString}`, "GET", undefined, options);
    }

    httpDelete(uri, options) {
        return this.httpRequest(uri, "DELETE", undefined, options);
    }

    httpRequest(uri, method, data, options) {
        const authToken = getCookie(envConfig.authToken);

        // Xử lý headers
        let headers = {
            ...(authToken && {'Authorization': `${authToken}`}),
        };

        // Bỏ qua Content-Type nếu data là FormData
        if (!(data instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }

        const body = data instanceof FormData ? data : JSON.stringify(data);

        return fetch(`/api${uri}`, {
            method: method,
            headers: {
                ...headers,
                ...(options && options.headers)
            },
            ...(method !== "GET" && data ? {body: body} : {}),
            ...options, // Gộp thêm các option bổ sung nếu cần
        }).then(async (response) => {
            if (!response.ok) {
                const errorData = await response.json();
                if (errorData) {
                    throw errorData;
                } else {
                    throw new Error("Error: " + response.statusText);
                }
            }
            return response;
        }).catch((error) => {
            console.log("API Request failed:", error);
            throw error;
        });
    }
}

export default ApiBase;