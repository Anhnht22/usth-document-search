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
        // Xử lý query params cho GET request
        const url = new URL(uri);
        if (params) {
            Object.keys(params).forEach((key) => {
                if (Array.isArray(params[key])) {
                    params[key].forEach((value) => {
                        // url.searchParams.append(key + "[]", value);
                        url.searchParams.append(key, value);
                    });
                } else {
                    url.searchParams.append(key, params[key]);
                }
            });
        }
        return this.httpRequest(url.toString(), "GET", undefined, options);
    }

    httpDelete(uri, options) {
        return this.httpRequest(uri, "DELETE", undefined, options);
    }

    httpRequest(uri, method, data, options) {
        const authToken = getCookie(envConfig.authToken);

        // Xử lý headers
        const headers = {
            ...(authToken && {'Authorization': `${authToken}`}),
        };

        // Bỏ qua Content-Type nếu data là FormData
        if (!(data instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }

        const body = data instanceof FormData ? data : JSON.stringify(data);

        return fetch(uri, {
            method: method,
            headers: headers,
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