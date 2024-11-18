import envConfig from "@/utils/envConfig";

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null;
}

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
                url.searchParams.append(key, params[key]);
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
            'Content-Type': 'application/json',
            ...(authToken && {'Authorization': `${authToken}`}),
        };

        return fetch(uri, {
            method: method,
            headers: headers,
            ...(method !== "GET" && data ? {body: JSON.stringify(data)} : {}),
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
            console.error("API Request failed:", error);
            throw error;
        });
    }
}

export default ApiBase;